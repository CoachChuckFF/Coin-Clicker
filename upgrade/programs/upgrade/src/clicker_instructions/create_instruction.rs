use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::sysvar::rent;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{set_authority, SetAuthority};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::token::spl_token::instruction::AuthorityType::MintTokens;

use crate::clicker_accounts::game_account::{Game, LeaderboardEntry};
use crate::clicker_globals::constants::GAME_SEED;


#[derive(Accounts)]
pub struct Create<'info>{
    #[account(
        init,
        seeds = [GAME_SEED, owner.key().as_ref()],
        bump,
        payer = owner,
        space = std::mem::size_of::<Game>() + 8,
    )]
    pub game: Account<'info, Game>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    // --------- Programs ----------
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    #[account(address = rent::id())]
    /// CHECK: We check it by address here
    pub rent: AccountInfo<'info>,
    

    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn run_create(ctx: Context<Create>, bump: u8) -> Result<()> {

    {
        msg!("Setting Auth to Game");

        set_authority(CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.owner.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            }), 
            MintTokens, 
             Some(ctx.accounts.game.key())
        )?;
    }

    {
        let game = &mut ctx.accounts.game;

        game.owner = ctx.accounts.owner.key().clone();
        game.mint = ctx.accounts.mint.key().clone();
        game.bump = bump;
        game.date_created = Clock::get()?.unix_timestamp;
        game.leaderboards = [LeaderboardEntry {
            wallet: Pubkey::default(),
            points: 0,
        }; 10];
    }


    Ok(())
}