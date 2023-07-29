use anchor_lang::prelude::*;
use anchor_lang::system_program::{Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, MintTo};
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::Game;
use crate::clicker_globals::constants::GAME_SEED;


#[derive(Accounts)]
pub struct Withdraw<'info>{
    #[account()]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        has_one = player,
        has_one = game,
        has_one = owner,
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

pub fn run_withdraw(ctx: Context<Withdraw>) -> Result<()> {

    let transfer_amount: u64 = ctx.accounts.player.lamports();
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(), 
        Transfer {
            from: ctx.accounts.player.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        });
    transfer(cpi_context, transfer_amount)?;

    {
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.owner_vault.to_account_info(),
                    authority: ctx.accounts.game.to_account_info(),
                },
                &[&[GAME_SEED, ctx.accounts.game.mint.as_ref(), &[ctx.accounts.game.bump]]],
            ),
            ctx.accounts.clicker.points,
        )?;
    }

    {
        let clicker = &mut ctx.accounts.clicker;

        clicker.last_updated = Clock::get()?.unix_timestamp;
        clicker.points = 0;
    }


    Ok(())
}