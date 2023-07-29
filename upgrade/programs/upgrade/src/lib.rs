use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

use clicker_instructions::click_instruction::*;
use clicker_instructions::upgrade_instruction::*;
use clicker_instructions::create_instruction::*;
use clicker_instructions::withdraw_instruction::*;
use clicker_instructions::deposit_instruction::*;
use clicker_instructions::submit_instruction::*;


// Instructions
mod clicker_instructions;

// Globals
mod clicker_globals;

// Accounts
mod clicker_accounts;

declare_id!("67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu");

#[program]
pub mod upgrade {

    use crate::clicker_instructions::{deposit_instruction::run_deposit, submit_instruction::run_submit};

    use super::*;

    pub fn create(ctx: Context<Create>, bump: u8) -> Result<()> {
        run_create(ctx, bump)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        run_click(ctx)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn upgrade(ctx: Context<Upgrade>, upgrade_index: u8, amount: u8) -> Result<()> {
        run_upgrade(ctx, upgrade_index, amount)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        run_withdraw(ctx)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        run_deposit(ctx)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn submit(ctx: Context<Submit>) -> Result<()> {
        run_submit(ctx)?;
        sol_log_compute_units();

        Ok(())
    }
}


