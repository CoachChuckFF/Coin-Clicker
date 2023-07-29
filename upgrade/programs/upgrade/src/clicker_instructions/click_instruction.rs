use anchor_lang::prelude::*;
use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_globals::constants::BASE_POINTS;

#[derive(Accounts)]
pub struct Click<'info>{
    #[account(
        mut,
        has_one = player,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn run_click(ctx: Context<Click>) -> Result<()> {
    let clicker = &mut ctx.accounts.clicker;
    let now = Clock::get()?.unix_timestamp;
    let mut points_to_add = 1;

    // points per click
    {
        // TODO: add modifiers
        points_to_add += clicker.clicker_modifiers[0] as u64;
    }

    // automated clickers
    {
        let seconds_passed = now - clicker.last_updated;

        for i in 0..=BASE_POINTS.len()-1 {
            points_to_add = points_to_add.saturating_add(
                (clicker.clicker_modifiers[i] as u64 + 1)
                * clicker.clicker_upgrades[i] as u64
                * BASE_POINTS[i] 
                * seconds_passed as u64
            )
        }
    }

    {
        clicker.last_updated = now;
        clicker.points = clicker.points.saturating_add(points_to_add);
    }

    Ok(())
}