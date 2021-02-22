// the meat of the logic. unique requests from user
function interpretString(userChoice) {
	if (
		/*====================================
             User wants an item described
         ===================================*/
		userChoice.includes('view')
	) {
		let item = userChoice.slice(1, userChoice.length);
		item = item.join(' ');
		describe(item);
	} else if (
		userChoice.includes('take') ||
		userChoice.includes('pickup') ||
		userChoice.includes('pick') ||
		userChoice.includes('grab')
	) {
		takeItem(userChoice);
	} else if (
		/*====================================
             User makes the bed
         ===================================*/
		(userChoice.includes('make') || userChoice.includes('fix') || userChoice.includes('tidy')) &&
		userChoice.includes('bed')
	) {
		if (guide.room === 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				if (guide.bed.isMade) {
					displayText = 'The BED is already made, but you decide to make it again anyway.';
				} else {
					displayText = `You make the BED. Well you didn't make it like create it. You just fluffed the PILLOW and straightened out the BLANKET to be aesthetically pleasing.`;
					guide.bed.isMade = true;
					guide.bed.description = `The BED has a PILLOW and a BLANKET. It is made.`;
				}
				guide.pillow.seen = true;
				guide.blanket.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User unmakes the bed
         ===================================*/
		((userChoice.includes('remove') || userChoice.includes('mess')) &&
			(userChoice.includes('blankets') ||
				userChoice.includes('bed') ||
				userChoice.includes('blanket') ||
				userChoice.includes('sheets'))) ||
		(userChoice.includes('unmake') && userChoice.includes('bed'))
	) {
		if (guide.room === 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				if (guide.bed.isMade === false) {
					displayText = 'The BED is messed up already.';
				} else {
					displayText = `You mess up the BED. I'm not sure why, but way to go.`;
					guide.bed.isMade = false;
					guide.bed.description = `The BED has a PILLOW and a BLANKET. It is not made.`;
				}
				guide.pillow.seen = true;
				guide.blanket.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User jumps on the bed
         ===================================*/
		userChoice.includes('jump') &&
		userChoice.includes('bed')
	) {
		if (guide.room === 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				displayText = `You jump on the BED. WEEEEEEEEEEE!`;
				guide.pillow.seen = true;
				guide.blanket.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User sits or lies on bed
         ===================================*/
		((userChoice.includes('lay') || userChoice.includes('sit') || userChoice.includes('lie')) &&
			userChoice.includes('bed')) ||
		userChoice.includes('sleep')
	) {
		if (guide.room === 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				displayText = `You consider resting on the BED, but then you realize there's no time to relax.`;
				guide.pillow.seen = true;
				guide.blanket.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the bed
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('bed')
	) {
		if (guide.room === 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				guide.wrench.room === 'inventory'
					? (displayText = 'You look under the BED and see nothing.')
					: (displayText = `You look under the BED and see a WRENCH.`);
				guide.wrench.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the blanket
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('blanket')
	) {
		if (guide.room === 'bedroom') {
			if (guide.blanket.seen) {
				setPrior();
				displayText = `It doesn't look like there's anything interesting here.`;
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the night stand
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('stand')
	) {
		if (guide.room === 'bedroom') {
			if (guide['night stand'].seen) {
				setPrior();
				displayText = `You look under the NIGHT STAND but find nothing.`;
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the pillow
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('pillow')
	) {
		if (guide.room === 'bedroom') {
			if (guide.pillow.seen) {
				setPrior();
				guide.change.room === 'inventory'
					? (displayText = 'You look under the PILLOW and see nothing.')
					: (displayText = `You look under the PILLOW and see some CHANGE.`);
				guide.change.seen = true;
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             Fix shower nozzle
         ===================================*/
		(userChoice.includes('fix') || userChoice.includes('repair') || userChoice.includes('wrench')) &&
		userChoice.includes('nozzle') &&
		userChoice.includes('shower')
	) {
		if (guide.room === 'bathroom') {
			if (guide['shower nozzle'].seen) {
				setPrior();
				if (guide['shower nozzle'].isFixed === false) {
					if (guide.wrench.room === 'inventory') {
						displayText = `You remove the SHOWER NOZZLE with the WRENCH and discover a DIAMOND KEY hidden inside. You take the DIAMOND KEY and put the SHOWER NOZZLE back on.`;
						guide['diamond key'].seen = true;
						guide['diamond key'].room = 'inventory';
						guide['diamond key'].canBeTaken = false;
						guide.inventory.push('diamond key');
						guide['shower nozzle'].isFixed = true;
						guide['shower nozzle'].description = 'A brass SHOWER NOZZLE that you recently fixed.';
						displaySeen();
						inventorySetup();
					} else {
						displayText = `You need some sort of tool to fix the SHOWER NOZZLE.`;
					}
				} else {
					displayText = `The SHOWER NOZZLE is already fixed. Thanks for doing that.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
            Try to unlock numlock
         ===================================*/
		(userChoice.includes('try') ||
			userChoice.includes('enter') ||
			userChoice.includes('code') ||
			userChoice.includes('set') ||
			userChoice.includes('use') ||
			userChoice.includes('check')) &&
		/\d/.test(userChoice)
	) {
		if (guide.book.room === 'inventory' || guide.room === 'bedroom') {
			setPrior();
			guide['number lock'].seen = true;
			if (userChoice.includes('8415')) {
				displayText = `The code works and the BOOK opens. Turns out it was actually a disguised case and it is holding a SQUARE KEY!`;
				guide.book.isLocked = false;
				guide[
					'number lock'
				].description = `The NUMBER LOCK has 4-digits on the code. It is currently set to 8415.`;
				guide.book.isOpen = true;
				guide['square key'].seen = true;
			} else {
				displayText = `You try to enter a code, but it doesn't work`;
			}
			displaySeen();
			setCurrent();
		} else {
			errorMessage();
		}
	} else if (
		/*====================================
             User opens book
         ===================================*/
		userChoice.includes('open') &&
		userChoice.includes('book')
	) {
		if (guide.room === 'bedroom' || guide.book.room === 'inventory') {
			if (guide.book.seen) {
				setPrior();
				if (guide.book.isLocked) {
					displayText = `The book is locked. There is a 4-digit NUMBER LOCK on it currently set to 0000.`;
					guide['number lock'].seen = true;
				} else {
					if (guide['square key'].room === 'inventory') {
						displayText = `You open the book, which turns out to be a disguised case. It is currently empty.`;
					} else {
						displayText = `You open the book, which turns out to be a disguised case. It is holding a SQUARE KEY.`;
					}
				}

				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User unlocks desk drawer
         ===================================*/
		(userChoice.includes('unlock') || userChoice.includes('key')) &&
		(userChoice.includes('desk') && userChoice.includes('drawer'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['desk drawer'].seen) {
				setPrior();
				if (guide['diamond key'].room === 'inventory') {
					if ((guide['scribbled note'].room = 'bedroom')) {
						displayText = `You unlock and open the DESK DRAWER, revealing a SCRIBBLED NOTE.`;
						guide['scribbled note'].seen = true;
						guide['desk drawer'].isLocked = false;
					} else {
						displayText = `You unlock and open the DESK DRAWER, but it's empty`;
					}
				} else {
					displayText = `It doesn't look like you have the key for the DESK DRAWER.`;
				}

				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User opens desk drawer
         ===================================*/
		userChoice.includes('open') &&
		(userChoice.includes('desk') && userChoice.includes('drawer'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['desk drawer'].seen) {
				setPrior();
				if (guide['desk drawer'].isLocked === false) {
					if ((guide['scribbled note'].room = 'bedroom')) {
						displayText = `You open the DESK DRAWER, revealing a SCRIBBLED NOTE.`;
						guide['scribbled note'].seen = true;
					} else {
						displayText = `You open the DESK DRAWER, but it's empty.`;
					}
				} else {
					displayText = `The DESK DRAWER is locked. It has a diamond-shaped hole.`;
				}

				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User ties something to pigeon
         ===================================*/
		(userChoice.includes('tie') || userChoice.includes('attach')) &&
		(userChoice.includes('note') ||
			userChoice.includes('paper') ||
			userChoice.includes('poem') ||
			userChoice.includes('ribbon')) &&
		userChoice.includes('pigeon')
	) {
		if (guide.pigeon.seen) {
			setPrior();
			if (guide.ribbon.room === 'inventory') {
				if (
					guide.poem.room === 'inventory' ||
					guide['scribbled note'].room === 'inventory' ||
					guide['scrap paper'].room === 'inventory'
				) {
					displayText = `You attach the message to the pigeon and it flies away. Miraculously, it finds the police who somehow are able to tell something is wrong. The pigeon leads them back to where you're locked up, and you're rescued. I mean, it sounds pretty realistic.`;
					if (guide.achievements.sentForHelp === false) {
						guide.achievements.sentForHelp = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-sentForHelp').show();
					}
					if (guide.achievements.alternateExit === false && guide.achievements.sentForHelp === true) {
						guide.achievements.alternateExit = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-alternateExit').show();
					}
					if (
						guide.achievements.allExits === false &&
						guide.achievements.sentForHelp === true &&
						guide.achievements.bloodyMary === true &&
						guide.achievements.frontDoor === true
					) {
						guide.achievements.allExits = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-allExits').show();
					}
					gameOver();
				} else {
					displayText = `It doesn't look like you have a paper or message to attach to the pigeon.`;
				}
			} else {
				displayText = `You don't have anything to tie with. If only you had a string or RIBBON.`;
			}
			setCurrent();
		} else {
			seeError();
		}
	} else if (
		/*====================================
             User ties something to pigeon
         ===================================*/
		userChoice.includes('scare') &&
		userChoice.includes('pigeon')
	) {
		if (guide.pigeon.seen) {
			setPrior();
			displayText = `The PIGEON continues to stare into your soul, but it seems sad as you try to scare it. It's almost as if it realizes the danger that you're in and knows that it can help you if you would just let it.`;
			setCurrent();
		} else {
			seeError();
		}
	} else if (
		/*====================================
             User burns scrap paper
         ===================================*/
		(userChoice.includes('burn') ||
			userChoice.includes('flame') ||
			userChoice.includes('fire') ||
			userChoice.includes('light')) &&
		userChoice.includes('paper')
	) {
		if (guide.room === 'bathroom') {
			setPrior();
			if (guide['scrap paper'].room === 'inventory') {
				if (guide.candle.isLit) {
					guide['scrap paper'].isBurned = true;
					guide['scrap paper'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('scrap paper'), 1);
					displayText = `You set the SCRAP PAPER on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac === false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').show();
					}
				} else {
					displayText = `The CANDLE isn't lit.`;
				}
			} else {
				displayText = `It doesn't look like you have that item in your inventory`;
			}
			inventorySetup();
			setCurrent();
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User burns scribbled note
         ===================================*/
		(userChoice.includes('burn') ||
			userChoice.includes('flame') ||
			userChoice.includes('fire') ||
			userChoice.includes('light')) &&
		userChoice.includes('note')
	) {
		if (guide.room === 'bathroom') {
			setPrior();
			if (guide['scribbled note'].room === 'inventory') {
				if (guide.candle.isLit) {
					guide['scribbled note'].isBurned = true;
					guide['scribbled note'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('scribbled note'), 1);
					displayText = `You set the SCRIBBLED NOTE on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac === false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').show();
					}
				} else {
					displayText = `The CANDLE isn't lit.`;
				}
			} else {
				displayText = `It doesn't look like you have that item in your inventory`;
			}
			inventorySetup();
			setCurrent();
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User burns poem
         ===================================*/
		(userChoice.includes('burn') ||
			userChoice.includes('flame') ||
			userChoice.includes('fire') ||
			userChoice.includes('light')) &&
		userChoice.includes('poem')
	) {
		if (guide.room === 'bathroom') {
			setPrior();
			if (guide['poem'].room === 'inventory') {
				if (guide.candle.isLit) {
					guide['poem'].isBurned = true;
					guide['poem'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('poem'), 1);
					displayText = `You set the POEM on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac === false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').show();
					}
				} else {
					displayText = `The CANDLE isn't lit.`;
				}
			} else {
				displayText = `It doesn't look like you have that item in your inventory`;
			}
			inventorySetup();
			setCurrent();
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User removes banana poster
         ===================================*/
		(userChoice.includes('rip') ||
			userChoice.includes('remove') ||
			userChoice.includes('take') ||
			userChoice.includes('pull') ||
			userChoice.includes('behind')) &&
		(userChoice.includes('banana') && !userChoice.includes('identical'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['banana poster'].seen) {
				setPrior();
				if (guide['banana poster'].isRemoved === false) {
					displayText = `You rip off the BANANA POSTER, revealing an IDENTICAL BANANA POSTER.`;
					guide['banana poster'].isRemoved = true;
					guide['identical banana poster'].seen = true;
					describeNorth();
					if (guide.achievements.dejaVu === false) {
						guide.achievements.dejaVu = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-dejaVu').show();
					}
				} else {
					displayText = `That poster was already removed. Are you thinking of the IDENTICAL BANANA POSTER?`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User removes identical banana poster
         ===================================*/
		(userChoice.includes('rip') ||
			userChoice.includes('remove') ||
			userChoice.includes('take') ||
			userChoice.includes('pull') ||
			userChoice.includes('behind')) &&
		userChoice.includes('identical')
	) {
		if (guide.room === 'bedroom') {
			if (guide['identical banana poster'].seen) {
				setPrior();
				if (guide['identical banana poster'].isRemoved === false) {
					displayText = `You rip off the IDENTICAL BANANA POSTER, revealing an ORANGE POSTER.`;
					guide['identical banana poster'].isRemoved = true;
					guide['orange poster'].seen = true;
					describeNorth();
					if (guide.achievements.orangeYouGlad === false) {
						guide.achievements.orangeYouGlad = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-orangeYouGlad').show();
					}
				} else {
					displayText = `That poster was already removed.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User removes orange poster
         ===================================*/
		(userChoice.includes('rip') ||
			userChoice.includes('remove') ||
			userChoice.includes('take') ||
			userChoice.includes('pull') ||
			userChoice.includes('behind')) &&
		userChoice.includes('orange')
	) {
		if (guide.room === 'bedroom') {
			if (guide['orange poster'].seen) {
				setPrior();
				if (guide['orange poster'].isRemoved === false) {
					displayText = `You rip off the ORANGE POSTER, revealing nothing hiding behind it.`;
					guide['orange poster'].isRemoved = true;
					describeNorth();
				} else {
					displayText = `That poster was already removed.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User removes movie poster
         ===================================*/
		(userChoice.includes('rip') ||
			userChoice.includes('remove') ||
			userChoice.includes('take') ||
			userChoice.includes('pull') ||
			userChoice.includes('behind')) &&
		userChoice.includes('movie')
	) {
		if (guide.room === 'bedroom') {
			if (guide['movie poster'].seen) {
				setPrior();
				if (guide['movie poster'].isRemoved === false) {
					displayText = `You rip off the MOVIE POSTER, revealing a large splatter of blood on the wall.`;
					guide['movie poster'].isRemoved = true;
					describeNorth();
				} else {
					displayText = `That poster was already removed. Remember the large splatter of blood?`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User unlocks blue door
         ===================================*/
		(userChoice.includes('unlock') || userChoice.includes('key')) &&
		(userChoice.includes('blue') && userChoice.includes('door'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['blue door'].seen) {
				setPrior();
				if (guide['heart key'].room === 'inventory') {
					displayText = `You unlock the BLUE DOOR.`;
					guide['blue door'].isLocked = false;
				} else {
					displayText = `It doesn't look like you have the key for the BLUE DOOR.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User unlocks red door
         ===================================*/
		(userChoice.includes('unlock') || userChoice.includes('key')) &&
		(userChoice.includes('red') && userChoice.includes('door'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['red door'].seen) {
				setPrior();
				if (guide['square key'].room === 'inventory') {
					displayText = `You unlock the RED DOOR.`;
					guide['red door'].isLocked = false;
				} else {
					displayText = `It doesn't look like you have the key for the RED DOOR.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User opens red door
         ===================================*/
		userChoice.includes('open') &&
		(userChoice.includes('red') && userChoice.includes('door'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['red door'].seen) {
				setPrior();
				if (guide['red door'].isLocked === false) {
					displayText = `You open the RED DOOR and escape!`;
					if (guide.achievements.frontDoor === false) {
						guide.achievements.frontDoor = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-frontDoor').show();
					}
					if (
						guide.achievements.allExits === false &&
						guide.achievements.sentForHelp === true &&
						guide.achievements.bloodyMary === true &&
						guide.achievements.frontDoor === true
					) {
						guide.achievements.allExits = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-allExits').show();
					}
					gameOver();
				} else {
					displayText = `It looks like the RED DOOR is locked.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User opens the blue door
         ===================================*/
		userChoice.includes('open') &&
		(userChoice.includes('blue') && userChoice.includes('door'))
	) {
		if (guide['blue door'].seen) {
			setPrior();
			if (guide['blue door'].isLocked === false) {
				if (guide.room === 'bedroom') {
					displayText = `You open the BLUE DOOR and walk into the BATHROOM.`;
					guide.bathroom.seen = true;
					guide.room = 'bathroom';
					guide.direction = 'north';
				} else if (guide.room === 'bathroom') {
					displayText = `You open the BLUE DOOR and walk into the BEDROOM.`;
					guide.room = 'bedroom';
					guide.direction = 'south';
				}
				displaySeen();
			} else {
				displayText = `It looks like the BLUE DOOR is locked.`;
			}
			setCurrent();
		} else {
			seeError();
		}
	} else if (
		/*====================================
             User opens top drawer
         ===================================*/
		(userChoice.includes('open') || userChoice.includes('look')) &&
		(userChoice.includes('top') && userChoice.includes('drawer'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['top drawer'].seen) {
				setPrior();
				if (guide.matches.room === 'inventory') {
					displayText = `You open the TOP DRAWER and peek inside. You see clothing.`;
				} else {
					displayText = `You open the TOP DRAWER and peek inside. You see clothing and some MATCHES.`;
					guide.matches.seen = true;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User opens bottom drawer
         ===================================*/
		(userChoice.includes('open') || userChoice.includes('look')) &&
		(userChoice.includes('bottom') && userChoice.includes('drawer'))
	) {
		if (guide.room === 'bedroom') {
			if (guide['bottom drawer'].seen) {
				setPrior();
				if (guide['scrap paper'].room === 'inventory') {
					displayText = `You open the BOTTOM DRAWER and peek inside. You see clothing.`;
				} else {
					displayText = `You open the BOTTOM DRAWER and peek inside. You see clothing and a SCRAP PAPER.`;
					guide['scrap paper'].seen = true;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the rug
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('rug')
	) {
		if (guide.room === 'bedroom') {
			if (guide.rug.seen) {
				setPrior();
				displayText = `You look under the RUG but only find dust.`;
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks under the bath mat
         ===================================*/
		(userChoice.includes('under') || userChoice.includes('beneath') || userChoice.includes('below')) &&
		userChoice.includes('mat')
	) {
		if (guide.room === 'bathroom') {
			if (guide['bath mat'].seen) {
				setPrior();
				displayText = `You look under the BATH MAT, but there's nothing there.`;
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns on the fan
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('on') &&
		userChoice.includes('fan')
	) {
		if (guide.room === 'bedroom') {
			if (guide['ceiling fan'].seen) {
				setPrior();
				if (guide['ceiling fan'].isOn === false) {
					if (guide['heart key'].onRug === true) {
						displayText = `You turn on the CEILING FAN and enjoy the breeze.`;
					} else {
						if (guide['heart key'].onRug === true || guide['heart key'].room === 'inventory') {
							displayText = `You turn on the CEILING FAN and enjoy the breeze.`;
						} else {
							guide['heart key'].seen = true;
							displayText = `You turn on the CEILING FAN, and a HEART KEY falls from the fan blades to the RUG.`;
							guide.rug.description = `A red, spiral RUG with a HEART KEY laying on it. The rug covers most of the floor.`;
							guide.bedroom.down = `There is a red, spiral RUG below your feet with a HEART KEY laying on it.`;
							guide['heart key'].onRug = true;
						}
					}
					guide['ceiling fan'].isOn = true;
					guide['ceiling fan'].description = 'A 5-bladed CEILING FAN. It is currently on.';
				} else {
					displayText = `The CEILING FAN is already on.`;
				}

				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns off the fan
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('off') &&
		userChoice.includes('fan')
	) {
		if (guide.room === 'bedroom') {
			if (guide['ceiling fan'].seen) {
				setPrior();
				if (guide['ceiling fan'].isOn === false) {
					displayText = `The CEILING FAN is already off.`;
				} else {
					displayText = `You feel too chilly, so you turn off the CEILING FAN.`;
					guide['ceiling fan'].isOn = false;
					guide['ceiling fan'].description = 'A 5-bladed CEILING FAN. It is currently off.';
				}

				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns on the light
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('on') &&
		!userChoice.includes('bathroom') &&
		userChoice.includes('light')
	) {
		if (guide.room === 'bedroom') {
			if (guide.light.seen) {
				setPrior();
				if (guide.light.isOn === false) {
					guide.light.isOn = true;
					displayText = `You turn on the LIGHT. You can see clearly now.`;
					guide.bedroom.up = `A CEILING FAN is above you. It has a LIGHT on it that's slowly burning into your retinas`;
					guide.light.description = `A LIGHT that's part of the CEILING FAN. It is currently on.`;
				} else {
					displayText = `The LIGHT is already on.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns off the light
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('off') &&
		!userChoice.includes('bathroom') &&
		userChoice.includes('light')
	) {
		if (guide.room === 'bedroom') {
			if (guide.light.seen) {
				setPrior();
				if (guide.light.isOn === true) {
					guide.light.isOn = false;
					displayText = `You turn off the LIGHT. The room is dim, but you're still able to see.`;
					guide.bedroom.up = `A CEILING FAN is above you. It has a LIGHT on it that's currently off and waiting to burn your retinas`;
					guide.light.description = `A LIGHT that's part of the CEILING FAN. It is currently off.`;
				} else {
					displayText = `The LIGHT is already off.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns on bathroom light
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('on') &&
		userChoice.includes('bathroom') &&
		userChoice.includes('light')
	) {
		if (guide.room === 'bathroom') {
			if (guide['bathroom light'].seen) {
				setPrior();
				if (guide['bathroom light'].isOn === false) {
					guide['bathroom light'].isOn = true;
					displayText = `You turn on the BATHROOM LIGHT. You can see clearly now.`;
				} else {
					displayText = `The BATHROOM LIGHT is already on.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns off bathroom light
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('off') &&
		userChoice.includes('bathroom') &&
		userChoice.includes('light')
	) {
		if (guide.room === 'bathroom') {
			if (guide['bathroom light'].seen) {
				setPrior();
				if (guide['bathroom light'].isOn === true) {
					guide['bathroom light'].isOn = false;
					displayText = `You turn off the BATHROOM LIGHT. The room is dim, but you're still able to see.`;
				} else {
					displayText = `The BATHROOM LIGHT is already off.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns on sink
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('on') &&
		userChoice.includes('sink')
	) {
		if (guide.room === 'bathroom') {
			if (guide.sink.seen) {
				setPrior();
				displayText = `You turn on the SINK, wash your hands, and turn the SINK back off.`;
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User unclogs the toilet
         ===================================*/
		(userChoice.includes('unclog') && userChoice.includes('toilet')) ||
		((userChoice.includes('use') || userChoice.includes('toilet')) && userChoice.includes('plunger'))
	) {
		if (guide.room === 'bathroom') {
			if (guide.toilet.seen) {
				setPrior();
				if (guide.toilet.isClogged === true) {
					if (guide.plunger.room === 'inventory') {
						displayText = `You unclog the TOILET revealing a disgusting mess someone left before you.`;
						guide.toilet.isClogged = false;
						guide.toilet.description = `A typical white porcelain TOILET. It's not clogged, but it does have some gross things left behind.`;
						if (guide.achievements.itsAMe === false) {
							guide.achievements.itsAMe = true;
							guide.achievements.count++;
							$('#achievement-count').text(guide.achievements.count);
							$('#achievement-itsAMe').show();
						}
					} else {
						displayText = `It doesn't look like you have a PLUNGER. Did you grab one?`;
					}
				} else {
					displayText = `The TOILET is already unclogged.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User flushes the toilet
         ===================================*/
		userChoice.includes('flush') &&
		userChoice.includes('toilet')
	) {
		if (guide.room === 'bathroom') {
			if (guide.toilet.seen) {
				setPrior();
				if (guide.toilet.isClogged === true) {
					displayText = 'It looks like the TOILET is clogged. Probably not a good idea to flush it.';
				} else {
					displayText = `You flush the TOILET. It's mildly satisfying.`;
					guide.toilet.description = `A typical white porcelain TOILET. It's clean inside.`;
					if (guide.achievements.ifItsBrown === false) {
						guide.achievements.ifItsBrown = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-ifItsBrown').show();
					}
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User opens bathroom window
         ===================================*/
		userChoice.includes('open') &&
		userChoice.includes('window')
	) {
		if (guide.room === 'bathroom') {
			if (guide['bathroom window'].seen) {
				setPrior();
				if (guide.pigeon.flewAway === false) {
					displayText = 'You open the BATHROOM WINDOW and see a PIGEON nearby.';
					guide.pigeon.seen = true;
				} else {
					displayText = `You open the BATHROOM WINDOW and breathe in the fresh air.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns on tub
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('on') &&
		(userChoice.includes('tub') || userChoice.includes('water'))
	) {
		if (guide.room === 'bathroom') {
			if (guide.tub.seen) {
				setPrior();
				if (guide.tub.isOn === false) {
					if (guide.diverter.currentPosition === 'down') {
						displayText = `You turn on the TUB and water comes out of the TUB NOZZLE.`;
					} else {
						if (guide['shower nozzle'].isFixed === false) {
							displayText = `You turn on the TUB and it looks like water is trying to come out of the SHOWER NOZZLE, but something is wrong with the SHOWER NOZZLE.`;
						} else {
							displayText = `You turn on the TUB and water shoots out of the SHOWER NOZZLE.`;
						}
					}
					guide['tub nozzle'].seen = true;
					guide['shower nozzle'].seen = true;
					guide.diverter.seen = true;
					guide.tub.isOn = true;
				} else {
					displayText = `The TUB is already on.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User turns off tub
         ===================================*/
		userChoice.includes('turn') &&
		userChoice.includes('off') &&
		(userChoice.includes('tub') || userChoice.includes('water'))
	) {
		if (guide.room === 'bathroom') {
			if (guide.tub.seen) {
				setPrior();
				if (guide.tub.isOn === true) {
					displayText = `You turn off the TUB, and the water stops.`;
					guide['tub nozzle'].seen = true;
					guide['shower nozzle'].seen = true;
					guide.diverter.seen = true;
					guide.tub.isOn = false;
				} else {
					displayText = `The TUB is already off.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User flips diverter
         ===================================*/
		!userChoice.includes('describe') &&
		userChoice.includes('diverter')
	) {
		if (guide.room === 'bathroom') {
			if (guide.diverter.seen) {
				setPrior();
				if (guide.tub.isOn === true) {
					if (guide.diverter.currentPosition === 'up') {
						displayText = `You flip the DIVERTER, and water comes out of the TUB NOZZLE.`;
						guide.diverter.currentPosition = 'down';
					} else {
						if (guide['shower nozzle'].isFixed === false) {
							displayText = `You flip the DIVERTER and it looks like water is trying to come out of the SHOWER NOZZLE, but something is wrong with the SHOWER NOZZLE.`;
						} else {
							displayText = `You flip the DIVERTER, and water shoots out of the SHOWER NOZZLE.`;
						}
						guide.diverter.currentPosition = 'up';
					}
				} else {
					if (guide.diverter.currentPosition === 'up') {
						guide.diverter.currentPosition = 'down';
					} else {
						guide.diverter.currentPosition = 'up';
					}
					displayText = `You flip the DIVERTER, which will change the direction of the water once the TUB is on.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User lights the candle
         ===================================*/
		(userChoice.includes('light') || userChoice.includes('matches')) &&
		userChoice.includes('candle')
	) {
		if (guide.room === 'bathroom') {
			if (guide.candle.seen) {
				setPrior();
				if (guide.candle.isLit === false) {
					displayText =
						'You light the CANDLE. From you peripherals, you almost feel like you saw someone in the BATHROOM MIRROR. Must have been a trick of the light.';
					guide.candle.isLit = true;
				} else {
					displayText = `The CANDLE is already lit. It's lit AF.`;
				}
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User says Bloody Mary
         ===================================*/
		userChoice.includes('bloody') &&
		userChoice.includes('mary')
	) {
		setPrior();
		if (guide.room === 'bathroom') {
			if (guide.candle.isLit && guide['bathroom light'].isOn === false) {
				displayText = `You repeat 'Bloody Mary' in front of the BATHROOM MIRROR. She appears and pulls you into her mirror world. At least you escaped.`;
				if (guide.achievements.bloodyMary === false) {
					guide.achievements.bloodyMary = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-bloodyMary').show();
				}
				if (guide.achievements.alternateExit === false && guide.achievements.bloodyMary === true) {
					guide.achievements.alternateExit = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-alternateExit').show();
				}
				if (
					guide.achievements.allExits === false &&
					guide.achievements.sentForHelp === true &&
					guide.achievements.bloodyMary === true &&
					guide.achievements.frontDoor === true
				) {
					guide.achievements.allExits = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-allExits').show();
				}
				gameOver();
			} else {
				displayText = `Nothing happens. Maybe you're doing it wrong.`;
			}
		} else {
			displayText = `Nothing happens. Maybe you're doing it wrong.`;
		}
		setCurrent();
	} else if (
		/*====================================
             User opens the cabinet
         ===================================*/
		userChoice.includes('open') &&
		userChoice.includes('cabinet')
	) {
		if (guide.room === 'bathroom') {
			if (guide.cabinet.seen) {
				setPrior();
				if (guide.plunger.room === 'bathroom') {
					displayText = `You open the CABINET. A PLUNGER is inside.`;
					guide.plunger.seen = true;
				} else {
					displayText = `You open the CABINET but nothing is inside.`;
				}
				displaySeen();
				setCurrent();
			} else {
				seeError();
			}
		} else {
			wrongRoomError();
		}
	} else if (
		/*====================================
             User looks in a direction - should be second to last because the verbs can be used for other things
         ===================================*/
		userChoice.includes('look') ||
		userChoice.includes('face') ||
		userChoice.includes('turn') ||
		userChoice.includes('go')
	) {
		checkDirection(userChoice[1]);
	} else {
		errorMessage();
	}
}