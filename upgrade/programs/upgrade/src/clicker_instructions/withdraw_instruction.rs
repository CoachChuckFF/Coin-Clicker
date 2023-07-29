use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::sysvar::rent;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, MintTo};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::token::spl_token::instruction::AuthorityType::MintTokens;

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::Game;
use crate::clicker_globals::constants::{GAME_SEED, CLICKER_SEED};


#[derive(Accounts)]
pub struct Withdraw<'info>{
    #[account()]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        has_one = player,
        has_one = game,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut, 
        constraint = game.mint == mint.key()
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = player,
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

pub fn run_withdraw(ctx: Context<Withdraw>) -> Result<()> {

    {
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.player_vault.to_account_info(),
                    authority: ctx.accounts.game.to_account_info(),
                },
                &[&[GAME_SEED, ctx.accounts.game.owner.as_ref(), &[ctx.accounts.game.bump]]],
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