use anchor_lang::prelude::*;

use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::{Game, LeaderboardEntry};
use crate::clicker_globals::errors::CodeErrors;
use anchor_lang::system_program::{Transfer, transfer};


#[derive(Accounts)]
pub struct Submit<'info>{
    #[account(mut)]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        close = player,
        has_one = player,
        has_one = game,
        has_one = owner,
    )]
    pub clicker: Account<'info, Clicker>,

    // --------- Programs ----------
    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
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
                wallet: ctx.accounts.owner.key().clone(),
                points: amount_to_submit,
            };
        } else {
            return Err(error!(CodeErrors::NotEnoughToSubmit));
        }
    }

    let transfer_amount: u64 = ctx.accounts.player.lamports();
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(), 
        Transfer {
            from: ctx.accounts.player.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        });
    transfer(cpi_context, transfer_amount)?;

    Ok(())
}