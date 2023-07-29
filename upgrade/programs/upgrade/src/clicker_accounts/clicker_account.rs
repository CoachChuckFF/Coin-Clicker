use anchor_lang::prelude::*;

#[account]
pub struct Clicker {
    pub initialized: bool,
    pub game: Pubkey,
    pub player: Pubkey,
    pub date_created: i64,
    pub last_updated: i64,
    pub points: u64,
    pub game_flags: u64,
    pub clicker_modifiers: [u8; 16],
    pub clicker_upgrades: [u16; 16],
}
