use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::sysvar::rent;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{burn, Burn};
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::{Game, LeaderboardEntry};
use crate::clicker_globals::constants::{CLICKER_SEED};
use crate::clicker_globals::errors::CodeErrors;


#[derive(Accounts)]
pub struct Submit<'info>{
    #[account(mut)]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        close = player,
        has_one = player,
        has_one = game,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn run_submit(ctx: Context<Submit>) -> Result<()> {

    let amount_to_submit = ctx.accounts.clicker.points;

    {
        let mut lowest_points_index = 0;
        let mut lowest_points_value = u64::MAX;
    
        for (i, entry) in ctx.accounts.game.leaderboards.iter().enumerate() {
            if entry.points < lowest_points_value {
                lowest_points_value = entry.points;
                lowest_points_index = i;
            }
        }
    
        if amount_to_submit > lowest_points_value {
            ctx.accounts.game.leaderboards[lowest_points_index] = LeaderboardEntry {
                wallet: ctx.accounts.player.key().clone(),
                points: amount_to_submit,
            };
        } else {
            return Err(error!(CodeErrors::NotEnoughToSubmit));
        }
    }

    Ok(())
}