# Coach's Coin Clicker

Click the coin, buy the upgrades, and get yourself on the Leaderboard! 

( Or keep the Coins to yourself! )

1. Click 'Deposit 0.01' to load your Player Wallet so it can click on your behalf
2. Click the coin! Buy the upgrades!
3. (A) Withdraw your Coins to your wallet 
-- OR --
3. (B) Submit your Coins to the leaderboard ( will reset your account )

Have Fun!
❤️ Coach Chuck

[Youtube Demo](https://youtu.be/J0gFV-dytkU)
[Video Demo Download](https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/clicker-demo.mov)

## Lore

It's Winter 2021, Solana is at an ATH of $260 and literally anything that came out made money. NFTs were all the craze and I was going to get into it. But, I was never a trader, so I started my Solana development career. I made my first game, completely on-chain called Sol-Treasure - a puzzle game. I presented it at the Miami Hackerhouse. It's been over a year and a half since then. I've traveled all over, met a lot of wonderful people, and built some really cool things. This clicker game, is a little memento for me, to show me how far I've come. The NFTs present, I still own, and serve as a great reminder of my wonderful experience developing in the Solana ecosystem. I sincerely hope you enjoy.

## General Info

Hey there! Here is the Coin Clicker Solana game! It is basically Solana's version of [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) that I made for the [Solana Speedrun Gamejam](https://solanaspeedrun.com/)

I am entering in the Fully On-Chain category!

And when I say *Fully* On-Chain, I mean it! Backend is written in Solana, Frontend is stored on ShadowDrive, and you can optionally provide your own RPC! - It's truly a perma-dapp!

Go play it now! [HERE](https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/index.html) or [coinclicker.xyz](coinclicker.xyz)

If you want to provide your own mainnet RPC; just add in the `?rpc=` with your [encoded](https://www.urlencoder.org/) mainnet rpc url!

For Example:
`https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/index.html?rpc=https%3A%2F%2Fapi.mainnet-beta.solana.com`

## Architecture
- Wallet - this is the user's browser wallet
- Player Wallet - Ephemeral wallet saved in local storage (***UNSAFE***) used to sign and pay transaction fees for the `Click` and `Upgrade` function calls
- Game Account - This is a Public account that I made, it has mint authority over the Coin token as well as hosts the leaderboard
- Clicker Account - This PDA is assigned to each user's Player Wallet - it keeps track of how many coins you have, and allows you to redeem your coins from your upgrades
  
The decision to keep the Player Wallet ephemeral was to allow the main game actions to be as seemless as possible. Local.storage is generally not a safe place for keypairs, however, this is a very low-stake game where I'm not overly worried about people losing it. Additionally, if they were to clear their cache, a new Player Wallet would be assigned to them. I def think the UX improvement outranks the game's security concerns.

Like I said before, all of the frontend files are hosted on shadowdrive using shadow.storage. You can see the relevant files [here](https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/asset-manifest.json)

And since I wanted to make this a truly perma-dApp, I allowed the ability to provide your own Mainnet RPC url as a parameter ( see above on how-to ).

Lastly, minus the keypairs, the entire project is open source - free forever. I hope some people get to play it, and more hopefully, people can copy it, make it better and learn from it!

## Keys
- Game Program Key: `67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu`
- Public Game Account: `vEpGgczgafr1PwXm3wy4TbkMBt1LFCE5YXiQ5bHWTtt`
- Public Game Mint: `5q41Qpy4HtEtUfWBHBxmVEjg3DCdJ8wgdoLkNmEGm1vY`

## Notes
- Desktop only, mobile looks terrible
- The "Player" keypair is kept in local storage - This is ***UNSAFE*** please do not put anything valuable in it. The only thing Player Keypair does is sign for the `Click` and `Upgrade` function. This was done so you don't have to approve each click.
- Clearing your browsers cache will generate you a new Player Keypair, so make sure you always withdraw or submit after a session!
- Submitting to the leaderboard is the only real objective of the game
- All sound effects are royalty-free and can be found at Pixabay.com - [composite sound file](https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/clicker-sounds.mp3)
- I own all of the NFTs present in the game ( although, I re-uploaded all of the artwork on shdw to keep everything together)
- The game's maths ( costs/upgrades ) are almost directly copied from [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/)
- Everything else is of my creation!
  

