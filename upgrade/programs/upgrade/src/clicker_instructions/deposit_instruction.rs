use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::sysvar::rent;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{burn, Burn};
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::Game;
use crate::clicker_globals::constants::{CLICKER_SEED};


#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account()]
    pub game: Account<'info, Game>,

    #[account(
        init_if_needed,
        seeds = [CLICKER_SEED, game.key().as_ref(), player.key().as_ref()],
        bump,
        payer = player,
        space = std::mem::size_of::<Clicker>() + 8,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut, 
        constraint = game.mint == mint.key()
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        // close = player,
        associated_token::mint = mint,
        associated_token::authority = player,
    )]
    pub player_vault: Account<'info, TokenAccount>,    

    // --------- Programs ----------
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn run_deposit(ctx: Context<Deposit>) -> Result<()> {

    let amount_to_burn = ctx.accounts.player_vault.amount;

    {
        burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.mint.to_account_info(),
                    from: ctx.accounts.player_vault.to_account_info(),
                    authority: ctx.accounts.player.to_account_info(),
                },
            ),
            amount_to_burn,
        )?;
    }

    {
        let clicker = &mut ctx.accounts.clicker;
        let now = Clock::get()?.unix_timestamp;

        if !clicker.initialized {
            clicker.initialized = true;
            clicker.player = ctx.accounts.player.key().clone();
            clicker.game = ctx.accounts.game.key().clone();
        
            clicker.points = amount_to_burn; 
            clicker.game_flags = 0;
            clicker.clicker_modifiers = [0; 16];
            clicker.clicker_upgrades = [0; 16];
            clicker.date_created = now;
            
        } else {
            clicker.points = clicker.points.saturating_add(amount_to_burn); 
        }
    

        clicker.last_updated = now;
    }


    Ok(())
}