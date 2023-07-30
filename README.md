# Coin-Clicker

Hey there! Here is the Coin Clicker Solana game! It is basically Solana's version of [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) that I made for the [Solana Speedrun Gamejam](https://solanaspeedrun.com/)

I am entering in the Fully On-Chain catagory!

And when I say *Fully* On-Chain, I mean it! Backend is written in Solana, Frontend is stored on ShadowDrive - It's truly a perma-dapp!

Go play it now! [HERE](https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/index.html) or [coinclicker.xyz](coinclicker.xyz)

You can even provide your RPC if you'd like! Just add in the `?rpc=` with your [encoded](https://www.urlencoder.org/) rpc url!

For Example:
`https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/index.html?rpc=https%3A%2F%2Fapi.mainnet-beta.solana.com`

Game Program Key: `67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu`
Public Game Account: `vEpGgczgafr1PwXm3wy4TbkMBt1LFCE5YXiQ5bHWTtt`
Public Game Mint: `5q41Qpy4HtEtUfWBHBxmVEjg3DCdJ8wgdoLkNmEGm1vY`

## Notes
- The "Player" keypair is kept in local storage - This is ***UNSAFE*** please do not put anything valuable in it. The only thing Player Keypair does is sign for the `Click` and `Upgrade` function. This was done so you don't have to approve each click.
- Submitting to the leaderboard is the only real objective of the game