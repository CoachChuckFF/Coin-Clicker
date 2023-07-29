use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{burn, Burn};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_lang::system_program::{Transfer, transfer};

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::Game;
use crate::clicker_globals::constants::CLICKER_SEED;


#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account()]
    pub game: Account<'info, Game>,

    #[account(
        init_if_needed,
        seeds = [CLICKER_SEED, game.key().as_ref(), player.key().as_ref()],
        bump,
        payer = owner,
        space = std::mem::size_of::<Clicker>() + 8,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut, 
        constraint = game.mint == mint.key()
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub owner_vault: Account<'info, TokenAccount>,    

    // --------- Programs ----------
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,

    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn run_deposit(ctx: Context<Deposit>) -> Result<()> {

    let transfer_amount: u64 = 10_000_000_u64;
    if ctx.accounts.player.lamports() < transfer_amount{
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.player.to_account_info(),
            });
        transfer(cpi_context, transfer_amount)?;
    }

    let amount_to_burn = ctx.accounts.owner_vault.amount;
    if amount_to_burn > 0 {
        burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.mint.to_account_info(),
                    from: ctx.accounts.owner_vault.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            amount_to_burn,
        )?;
    }

    {
        let clicker = &mut ctx.accounts.clicker;
        let now = Clock::get()?.unix_timestamp;
    
        if !clicker.initalized {
            clicker.initalized = true;
            clicker.player = ctx.accounts.player.key().clone();
            clicker.owner = ctx.accounts.owner.key().clone();
            clicker.game = ctx.accounts.game.key().clone();
        
            clicker.points = amount_to_burn + 1; 
            clicker.game_flags = 0;
            clicker.clicker_modifiers = [0; 16];
            clicker.clicker_upgrades = [0; 16];
            clicker.date_created = now;
        } else {
            clicker.points = clicker.points.saturating_add(amount_to_burn.saturating_add(1));
        }
    
        clicker.last_updated = now;
    }


    Ok(())
}