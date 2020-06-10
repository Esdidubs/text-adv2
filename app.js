'use strict';

// global variables
let guide;
let displayText = '';

// runs at start. sets up guide variable, displays inventory and seen box
$(function() {
	let resetVariables = {
		achCount : 0,
		ach1     : false,
		ach2     : false,
		ach3     : false,
		ach4     : false,
		ach5     : false,
		ach6     : false,
		ach7     : false,
		ach8     : false,
		ach9     : false,
		ach10    : false,
		ach11    : false
	};
	resetGame(resetVariables);
	buttons();
	inventorySetup();
	displaySeen();
});

// updates inventory to show anything held
function inventorySetup() {
	let itemList = [];
	for (let item in guide.inventory) {
		itemList.push(guide.inventory[item]);
	}
	let invCount = itemList.length;
	let itemString = itemList.join(', ');

	$('#inventoryZone').replaceWith(` 
        <div id="inventoryZone">
            <span>Inventory (${invCount})</span>
            <div class="inventoryItem">${itemString}</div>
        </div>
    `);
}

// updates all items seen
function displaySeen() {
	let itemList = [];
	for (let item in guide) {
		if (guide[item].seen == true) itemList.push(guide[item].name);
	}
	let invCount = itemList.length;
	let itemString = itemList.join(', ');

	$('#seenZone').replaceWith(` 
        <div id="seenZone">
            <span>Seen Items (${invCount}/52)</span>
            <div class="seenItem">${itemString}</div>
        </div>
    `);

	if (invCount == 52) {
		if (guide.achievements.seenItAll == false) {
			guide.achievements.seenItAll = true;
			guide.achievements.count++;
			$('#achievement-count').text(guide.achievements.count);
			$('#achievement-seenItAll').removeClass('hidden');
		}
	}
}

// allows buttons to work. Using main for onclick because main always exists
function buttons() {
	$('main').on('click', '#actionBtn', function() {
		event.preventDefault();
		let userChoice = $('#actionInput').val();
		$('#actionInput').val('');
		userChoice = userChoice.replace(/[.,\/#!$%\^&\*;@:{}=\-_`~()]/g, '');
		userChoice = userChoice.toLowerCase().split(' ');
		interpretString(userChoice);
	});

	$('main').on('click', '#keepBtn', function() {
		event.preventDefault();
		let resetVariables = {
			achCount : guide.achievements.count,
			ach1     : guide.achievements.seenItAll,
			ach2     : guide.achievements.ifItsBrown,
			ach3     : guide.achievements.sentForHelp,
			ach4     : guide.achievements.alternateExit,
			ach5     : guide.achievements.bloodyMary,
			ach6     : guide.achievements.frontDoor,
			ach7     : guide.achievements.allExits,
			ach8     : guide.achievements.orangeYouGlad,
			ach9     : guide.achievements.itsAMe,
			ach10    : guide.achievements.pyromaniac,
			ach11    : guide.achievements.dejaVu
		};
		resetGame(resetVariables);
		inventorySetup();
		displaySeen();
	});

	$('main').on('click', '#eraseBtn', function() {
		event.preventDefault();
		$('.achievement').addClass('hidden');
		let resetVariables = {
			achCount : 0,
			ach1     : false,
			ach2     : false,
			ach3     : false,
			ach4     : false,
			ach5     : false,
			ach6     : false,
			ach7     : false,
			ach8     : false,
			ach9     : false,
			ach10    : false,
			ach11    : false
		};
		resetGame(resetVariables);
		inventorySetup();
		displaySeen();
		$('#achievement-count').text(guide.achievements.count);
	});
}

// sets current text to the prior so user remembers last message
function setPrior() {
	guide.priorMessage = guide.currentMessage;
	$('#priorZone').replaceWith(` 
            <div id="priorZone">
                <p>${guide.priorMessage}</p>
            </div>  
        `);
}

// updates the current message to respond to user
function setCurrent() {
	$('#storyZone').replaceWith(` 
        <div id="storyZone">
            <p id="storyText">${displayText}</p>
        </div>  
    `);
	guide.currentMessage = displayText;
}

// used to explain an item or room using its description
function describe(item) {
	if (guide[item] == undefined) {
		setPrior();
		$('#storyZone').replaceWith(`
            <div id="storyZone">
            <p id="storyText">I'm not sure what you're asking me to describe. Try again.</p>
            </div>
        `);
	} else {
		if (item == 'room' || item == 'bedroom' || item == 'bathroom') {
			if ((item == 'room' || item == 'bedroom') && guide.room == 'bedroom') {
				guide.bed.seen = true;
				guide.desk.seen = true;
				guide.dresser.seen = true;
				guide['blue door'].seen = true;
				displaySeen();
				setPrior();
				displayText = guide[guide.room].description;
				setCurrent();
			} else if ((item == 'room' || item == 'bathroom') && guide.room == 'bathroom') {
				guide.sink.seen = true;
				guide['blue door'].seen = true;
				guide.tub.seen = true;
				guide.toilet.seen = true;
				displaySeen();
				setPrior();
				displayText = guide[guide.room].description;
				setCurrent();
			} else {
				setPrior();
				displayText = `You are not currently in the ${item}.`;
				setCurrent();
			}
		} else {
			if (guide[item].seen == true) {
				lookAtItem(item);
			} else {
				seeError();
			}
		}
	}
}

// used to explain an item using its description
function lookAtItem(item) {
	if (guide[item].room == guide.room || guide[item].room == 'inventory') {
		setPrior();
		displayText = guide[item].description;
		setCurrent();
		if (item == 'bed') {
			guide.pillow.seen = true;
			guide.blanket.seen = true;
		} else if (item == 'night stand') {
			guide.book.seen = true;
		} else if (item == 'book') {
			guide['number lock'].seen = true;
		} else if (item == 'desk') {
			guide['desk drawer'].seen = true;
			guide.poem.seen = true;
		} else if (item == 'dresser') {
			guide['top drawer'].seen = true;
			guide['bottom drawer'].seen = true;
		} else if (item == 'sink') {
			guide.cabinet.seen = true;
			guide.candle.seen = true;
		} else if (item == 'tub') {
			guide['tub nozzle'].seen = true;
			guide['shower nozzle'].seen = true;
			guide.diverter.seen = true;
		} else if (item == 'wastebin') {
			guide.ribbon.seen = true;
		}
		displaySeen();
	} else {
		wrongRoomError();
	}
}

// if user uses left or right, it translates to cardinal directions
function checkDirection(direction) {
	let newDir = direction;
	if (newDir == 'left') {
		guide.direction == 'west'
			? (newDir = 'south')
			: guide.direction == 'south'
				? (newDir = 'east')
				: guide.direction == 'east' ? (newDir = 'north') : (newDir = 'west');
	} else if (newDir == 'right') {
		guide.direction == 'west'
			? (newDir = 'north')
			: guide.direction == 'north'
				? (newDir = 'east')
				: guide.direction == 'east' ? (newDir = 'south') : (newDir = 'west');
	}
	if (!(guide[guide.room][newDir] == undefined)) {
		lookDirection(newDir);
	} else {
		errorMessage();
	}
}

// updating the cardinal direction user is looking at
function lookDirection(direction) {
	setPrior();
	guide.direction = direction;
	displayText = guide[guide.room][direction];
	setCurrent();
	if (guide.room == 'bedroom') {
		if (guide.direction == 'west') {
			guide.bed.seen = true;
			guide['night stand'].seen = true;
		} else if (guide.direction == 'north') {
			guide['blue door'].seen = true;
			guide['banana poster'].seen = true;
			guide['movie poster'].seen = true;
		} else if (guide.direction == 'east') {
			guide.dresser.seen = true;
			guide.mirror.seen = true;
		} else if (guide.direction == 'south') {
			guide.desk.seen = true;
			guide['red door'].seen = true;
			guide.wastebin.seen = true;
		} else if (guide.direction == 'up') {
			guide['ceiling fan'].seen = true;
			guide.light.seen = true;
		} else if (guide.direction == 'down') {
			guide.rug.seen = true;
		}
	} else {
		if (guide.direction == 'west') {
			guide.sink.seen = true;
			guide['bathroom mirror'].seen = true;
		} else if (guide.direction == 'north') {
			guide['towel rack'].seen = true;
			guide.toilet.seen = true;
		} else if (guide.direction == 'east') {
			guide.tub.seen = true;
			guide['shower curtain'].seen = true;
			guide['bathroom window'].seen = true;
		} else if (guide.direction == 'south') {
			guide.plant.seen = true;
			guide['blue door'].seen = true;
		} else if (guide.direction == 'up') {
			guide['bathroom light'].seen = true;
		} else if (guide.direction == 'down') {
			guide['bath mat'].seen = true;
		}
	}
	displaySeen();
}

// allows user to grab things to add to their inventory
function takeItem(userChoice) {
	userChoice = userChoice.join(' ');
	let item;
	for (let obj in guide) {
		if (userChoice.includes(obj)) {
			item = obj;
		}
	}
	if (!(guide[item] == undefined)) {
		if (guide[item].seen == true) {
			if (guide[item].room == guide.room) {
				setPrior();
				if (guide[item].canBeTaken == true) {
					displayText = `You took the ${item}`;
					guide[item].canBeTaken = false;
					guide[item].room = 'inventory';
					guide.inventory.push(item);
					inventorySetup();
					if (item == 'book') {
						guide['night stand'].description = `A small bedside NIGHT STAND.`;
					} else if (item == 'poem') {
						guide.desk.description = `A wooden DESK with a single DESK DRAWER.`;
					} else if (item == 'ribbon') {
						guide.wastebin.description = `A WASTEBIN that's empty. What a bunch of rubbish.`;
					} else if (item == 'heart key') {
						guide.rug.description = 'A red, spiral RUG. It covers most of the floor.';
						guide.bedroom.down = `There is a red, spiral RUG below your feet.`;
					} else if (item == 'plunger') {
						displayText = 'You take the PLUNGER and close the CABINET.';
					}
				} else {
					displayText = `The item either can't be taken or it's already in your inventory.`;
				}
				setCurrent();
			} else {
				wrongRoomError();
			}
		} else {
			seeError();
		}
	} else {
		errorMessage();
	}
}

// bedroom north is complicated because multiple items can be removed. This function helps break it down
function describeNorth() {
	if (guide['banana poster'].isRemoved == false && guide['movie poster'].isRemoved == false) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, a BANANA POSTER, and a MOVIE POSTER`;
	} else if (guide['banana poster'].isRemoved == false && guide['movie poster'].isRemoved == true) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, a BANANA POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['banana poster'].isRemoved == true &&
		guide['identical banana poster'].isRemoved == false &&
		guide['movie poster'].isRemoved == true
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an IDENTICAL BANANA POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['orange poster'].isRemoved == false &&
		guide['identical banana poster'].isRemoved == true &&
		guide['movie poster'].isRemoved == true
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an ORANGE POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (guide['orange poster'].isRemoved == true && guide['movie poster'].isRemoved == true) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['banana poster'].isRemoved == true &&
		guide['identical banana poster'].isRemoved == false &&
		guide['movie poster'].isRemoved == false
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an IDENTICAL BANANA POSTER, and a MOVIE POSTER.`;
	} else if (
		guide['orange poster'].isRemoved == false &&
		guide['identical banana poster'].isRemoved == true &&
		guide['movie poster'].isRemoved == false
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an ORANGE POSTER, and a MOVIE POSTER.`;
	} else if (guide['orange poster'].isRemoved == true && guide['movie poster'].isRemoved == false) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR and a MOVIE POSTER.`;
	}
}

// user inputs something not accounted for
function errorMessage() {
	setPrior();
	$('#storyZone').replaceWith(`
        <div id="storyZone">
            <p id="storyText">I don't understand what you want from me. Try inputting something else.</p>
        </div>
    `);
}

// user hasn't seen an item they try to interact with
function seeError() {
	setPrior();
	$('#storyZone').replaceWith(`
        <div id="storyZone">
        <p id="storyText">I don't think you've seen that item. Try again or look around the room for it first.</p>
        </div>
    `);
}

// user interacts with something in another room
function wrongRoomError() {
	setPrior();
	$('#storyZone').replaceWith(`
        <div id="storyZone">
        <p id="storyText">It doesn't look like that item is in the room.</p>
        </div>
    `);
}

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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				if (guide.bed.isMade == false) {
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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom') {
			if (guide.bed.seen) {
				setPrior();
				guide.wrench.room == 'inventory'
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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom') {
			if (guide.pillow.seen) {
				setPrior();
				guide.change.room == 'inventory'
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
		if (guide.room == 'bathroom') {
			if (guide['shower nozzle'].seen) {
				setPrior();
				if (guide['shower nozzle'].isFixed == false) {
					if (guide.wrench.room == 'inventory') {
						displayText = `You remove the SHOWER NOZZLE with the WRENCH and discover a DIAMOND KEY hidden inside. You take the DIAMOND KEY and put the SHOWER NOZZLE back on.`;
						guide['diamond key'].seen = true;
						guide['diamond key'].room = 'inventory';
						guide['diamond key'].canBeTaken = false;
						guide.inventory.push('diamond key');
						guide['shower nozzle'].isFixed = true;
						guide['shower nozzle'].description = 'A brass SHOWER NOZZLE that you recently fixed.';
						inventorySetup();
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
			userChoice.includes('try') ||
			userChoice.includes('check')) &&
		/\d/.test(userChoice)
	) {
		if (guide.book.room == 'inventory' || guide.room == 'bedroom') {
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
		if (guide.room == 'bedroom' || guide.book.room == 'inventory') {
			if (guide.book.seen) {
				setPrior();
				if (guide.book.isLocked) {
					displayText = `The book is locked. There is a 4-digit NUMBER LOCK on it currently set to 0000.`;
					guide['number lock'].seen = true;
				} else {
					if (guide['square key'].room == 'inventory') {
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
		if (guide.room == 'bedroom') {
			if (guide['desk drawer'].seen) {
				setPrior();
				if (guide['diamond key'].room == 'inventory') {
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
		if (guide.room == 'bedroom') {
			if (guide['desk drawer'].seen) {
				setPrior();
				if (guide['desk drawer'].isLocked == false) {
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
		(userChoice.includes('note') || userChoice.includes('paper') || userChoice.includes('poem')) &&
		userChoice.includes('pigeon')
	) {
		if (guide.pigeon.seen) {
			setPrior();
			if (guide.ribbon.room == 'inventory') {
				if (
					guide.poem.room == 'inventory' ||
					guide['scribbled note'].room == 'inventory' ||
					guide['scrap paper'].room == 'inventory'
				) {
					displayText = `You attach the message to the pigeon and it flies away. Miraculously, it finds the police who somehow are able to tell something is wrong. The pigeon leads them back to where you're locked up, and you're rescued. I mean, it sounds pretty realistic.`;
					if (guide.achievements.sentForHelp == false) {
						guide.achievements.sentForHelp = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-sentForHelp').removeClass('hidden');
					}
					if (guide.achievements.alternateExit == false && guide.achievements.bloodyMary == true) {
						guide.achievements.alternateExit = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-alternateExit').removeClass('hidden');
					}
					if (
						guide.achievements.allExits == false &&
						guide.achievements.sentForHelp == true &&
						guide.achievements.bloodyMary == true &&
						guide.achievements.frontDoor == true
					) {
						guide.achievements.allExits = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-allExits').removeClass('hidden');
					}
					$('#inputZone').replaceWith(` 
                    <form id="inputZone">
                    </form>
                `);
					$('#priorZone').replaceWith(` 
                    <form id="priorZone">
                    </form>
                `);
					$('#inventoryZone').replaceWith(` 
                    <form id="inventoryZone">
                    </form>
                `);
					$('#seenZone').replaceWith(` 
                    <form id="seenZone">
                    </form>
                `);
					$('#gameOverZone').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			setPrior();
			if (guide['scrap paper'].room == 'inventory') {
				if (guide.candle.isLit) {
					guide['scrap paper'].isBurned = true;
					guide['scrap paper'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('scrap paper'), 1);
					displayText = `You set the SCRAP PAPER on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac == false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			setPrior();
			if (guide['scribbled note'].room == 'inventory') {
				if (guide.candle.isLit) {
					guide['scribbled note'].isBurned = true;
					guide['scribbled note'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('scribbled note'), 1);
					displayText = `You set the SCRIBBLED NOTE on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac == false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			setPrior();
			if (guide['poem'].room == 'inventory') {
				if (guide.candle.isLit) {
					guide['poem'].isBurned = true;
					guide['poem'].room = 'burned';
					guide.inventory.splice(guide.inventory.indexOf('poem'), 1);
					displayText = `You set the POEM on fire and watch as it slowly turns to ash. A part of you dies, but another part of you comes alive.`;
					if (
						guide.achievements.pyromaniac == false &&
						guide['scrap paper'].isBurned &&
						guide['scribbled note'].isBurned &&
						guide.poem.isBurned
					) {
						guide.achievements.pyromaniac = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-pyromaniac').removeClass('hidden');
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
		if (guide.room == 'bedroom') {
			if (guide['banana poster'].seen) {
				setPrior();
				if (guide['banana poster'].isRemoved == false) {
					displayText = `You rip off the BANANA POSTER, revealing an IDENTICAL BANANA POSTER.`;
					guide['banana poster'].isRemoved = true;
					guide['identical banana poster'].seen = true;
					describeNorth();
					if (guide.achievements.dejaVu == false) {
						guide.achievements.dejaVu = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-dejaVu').removeClass('hidden');
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
		if (guide.room == 'bedroom') {
			if (guide['identical banana poster'].seen) {
				setPrior();
				if (guide['identical banana poster'].isRemoved == false) {
					displayText = `You rip off the IDENTICAL BANANA POSTER, revealing an ORANGE POSTER.`;
					guide['identical banana poster'].isRemoved = true;
					guide['orange poster'].seen = true;
					describeNorth();
					if (guide.achievements.orangeYouGlad == false) {
						guide.achievements.orangeYouGlad = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-orangeYouGlad').removeClass('hidden');
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
		if (guide.room == 'bedroom') {
			if (guide['orange poster'].seen) {
				setPrior();
				if (guide['orange poster'].isRemoved == false) {
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
		if (guide.room == 'bedroom') {
			if (guide['movie poster'].seen) {
				setPrior();
				if (guide['movie poster'].isRemoved == false) {
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
		if (guide.room == 'bedroom') {
			if (guide['blue door'].seen) {
				setPrior();
				if (guide['heart key'].room == 'inventory') {
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
		if (guide.room == 'bedroom') {
			if (guide['red door'].seen) {
				setPrior();
				if (guide['square key'].room == 'inventory') {
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
		if (guide.room == 'bedroom') {
			if (guide['red door'].seen) {
				setPrior();
				if (guide['red door'].isLocked == false) {
					displayText = `You open the RED DOOR and escape!`;
					if (guide.achievements.frontDoor == false) {
						guide.achievements.frontDoor = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-frontDoor').removeClass('hidden');
					}
					if (
						guide.achievements.allExits == false &&
						guide.achievements.sentForHelp == true &&
						guide.achievements.bloodyMary == true &&
						guide.achievements.frontDoor == true
					) {
						guide.achievements.allExits = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-allExits').removeClass('hidden');
					}
					$('#inputZone').replaceWith(` 
                    <form id="inputZone">
                    </form>
                `);
					$('#priorZone').replaceWith(` 
                    <form id="priorZone">
                    </form>
                `);
					$('#inventoryZone').replaceWith(` 
                    <form id="inventoryZone">
                    </form>
                `);
					$('#seenZone').replaceWith(` 
                    <form id="seenZone">
                    </form>
                `);
					$('#gameOverZone').removeClass('hidden');
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
			if (guide['blue door'].isLocked == false) {
				if (guide.room == 'bedroom') {
					displayText = `You open the BLUE DOOR and walk into the BATHROOM.`;
					guide.bathroom.seen = true;
					guide.room = 'bathroom';
					guide.direction = 'north';
				} else if (guide.room == 'bathroom') {
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
		if (guide.room == 'bedroom') {
			if (guide['top drawer'].seen) {
				setPrior();
				if (guide.matches.room == 'inventory') {
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
		if (guide.room == 'bedroom') {
			if (guide['bottom drawer'].seen) {
				setPrior();
				if (guide['scrap paper'].room == 'inventory') {
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
		if (guide.room == 'bedroom') {
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
		if (guide.room == 'bathroom') {
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
		if (guide.room == 'bedroom') {
			if (guide['ceiling fan'].seen) {
				setPrior();
				if (guide['ceiling fan'].isOn == false) {
					if (guide['heart key'].onRug == true) {
						displayText = `You turn on the CEILING FAN and enjoy the breeze.`;
						guide['ceiling fan'].isOn = true;
					} else {
						guide['heart key'].seen = true;
						displayText = `You turn on the CEILING FAN, and a HEART KEY falls from the fan blades to the RUG.`;
						guide.rug.description = `A red, spiral RUG with a HEART KEY laying on it. The rug covers most of the floor.`;
						guide.bedroom.down = `There is a red, spiral RUG below your feet with a HEART KEY laying on it.`;
					}
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
		if (guide.room == 'bedroom') {
			if (guide['ceiling fan'].seen) {
				setPrior();
				if (guide['ceiling fan'].isOn == false) {
					displayText = `The CEILING FAN is already off.`;
				} else {
					displayText = `You feel too chilly, so you turn off the CEILING FAN.`;
					guide['ceiling fan'].isOn = false;
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
		if (guide.room == 'bedroom') {
			if (guide.light.seen) {
				setPrior();
				if (guide.light.isOn == false) {
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
		if (guide.room == 'bedroom') {
			if (guide.light.seen) {
				setPrior();
				if (guide.light.isOn == true) {
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
		if (guide.room == 'bathroom') {
			if (guide['bathroom light'].seen) {
				setPrior();
				if (guide['bathroom light'].isOn == false) {
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
		if (guide.room == 'bathroom') {
			if (guide['bathroom light'].seen) {
				setPrior();
				if (guide['bathroom light'].isOn == true) {
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
		if (guide.room == 'bathroom') {
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
		if (guide.room == 'bathroom') {
			if (guide.toilet.seen) {
				setPrior();
				if (guide.toilet.isClogged == true) {
					if (guide.plunger.room == 'inventory') {
						displayText = `You unclog the TOILET revealing a disgusting mess someone left before you.`;
						guide.toilet.isClogged = false;
						guide.toilet.description = `A typical white porcelain TOILET. It's not clogged, but it does have some gross things left behind.`;
						if (guide.achievements.itsAMe == false) {
							guide.achievements.itsAMe = true;
							guide.achievements.count++;
							$('#achievement-count').text(guide.achievements.count);
							$('#achievement-itsAMe').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			if (guide.toilet.seen) {
				setPrior();
				if (guide.toilet.isClogged == true) {
					displayText = 'It looks like the TOILET is clogged. Probably not a good idea to flush it.';
				} else {
					displayText = `You flush the TOILET. It's mildly satisfying.`;
					guide.toilet.description = `A typical white porcelain TOILET. It's clean inside.`;
					if (guide.achievements.ifItsBrown == false) {
						guide.achievements.ifItsBrown = true;
						guide.achievements.count++;
						$('#achievement-count').text(guide.achievements.count);
						$('#achievement-ifItsBrown').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			if (guide['bathroom window'].seen) {
				setPrior();
				if (guide.pigeon.flewAway == false) {
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
		userChoice.includes('tub')
	) {
		if (guide.room == 'bathroom') {
			if (guide.tub.seen) {
				setPrior();
				if (guide.tub.isOn == false) {
					if (guide.diverter.currentPosition == 'down') {
						displayText = `You turn on the TUB and water comes out of the TUB NOZZLE.`;
					} else {
						if (guide['shower nozzle'].isFixed == false) {
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
		userChoice.includes('tub')
	) {
		if (guide.room == 'bathroom') {
			if (guide.tub.seen) {
				setPrior();
				if (guide.tub.isOn == true) {
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
		if (guide.room == 'bathroom') {
			if (guide.diverter.seen) {
				setPrior();
				if (guide.tub.isOn == true) {
					if (guide.diverter.currentPosition == 'up') {
						displayText = `You flip the DIVERTER, and water comes out of the TUB NOZZLE.`;
						guide.diverter.currentPosition = 'down';
					} else {
						if (guide['shower nozzle'].isFixed == false) {
							displayText = `You flip the DIVERTER and it looks like water is trying to come out of the SHOWER NOZZLE, but something is wrong with the SHOWER NOZZLE.`;
						} else {
							displayText = `You flip the DIVERTER, and water shoots out of the SHOWER NOZZLE.`;
						}
						guide.diverter.currentPosition = 'up';
					}
				} else {
					if (guide.diverter.currentPosition == 'up') {
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
		if (guide.room == 'bathroom') {
			if (guide.candle.seen) {
				setPrior();
				if (guide.candle.isLit == false) {
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
		if (guide.room == 'bathroom') {
			if (guide.candle.isLit && guide['bathroom light'].isOn == false) {
				displayText = `You repeat 'Bloody Mary' in front of the BATHROOM MIRROR. She appears and pulls you into her mirror world. At least you escaped.`;
				if (guide.achievements.bloodyMary == false) {
					guide.achievements.bloodyMary = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-bloodyMary').removeClass('hidden');
				}
				if (guide.achievements.alternateExit == false && guide.achievements.bloodyMary == true) {
					guide.achievements.alternateExit = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-alternateExit').removeClass('hidden');
				}
				if (
					guide.achievements.allExits == false &&
					guide.achievements.sentForHelp == true &&
					guide.achievements.bloodyMary == true &&
					guide.achievements.frontDoor == true
				) {
					guide.achievements.allExits = true;
					guide.achievements.count++;
					$('#achievement-count').text(guide.achievements.count);
					$('#achievement-allExits').removeClass('hidden');
				}
				$('#inputZone').replaceWith(` 
                    <form id="inputZone">
                    </form>
                `);
				$('#priorZone').replaceWith(` 
                    <form id="priorZone">
                    </form>
                `);
				$('#inventoryZone').replaceWith(` 
                    <form id="inventoryZone">
                    </form>
                `);
				$('#seenZone').replaceWith(` 
                    <form id="seenZone">
                    </form>
                `);
				$('#gameOverZone').removeClass('hidden');
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
		if (guide.room == 'bathroom') {
			if (guide.cabinet.seen) {
				setPrior();
				if (guide.plunger.room == 'bathroom') {
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

// resets the dom and establishes the guide variable
function resetGame(resetVariables) {
	console.log('resetting');
	$('#inputZone').replaceWith(` 
            <form id="inputZone">
            <input type="text" id="actionInput" name="actionInput">
            <button id="actionBtn">Go</button>
        </form>
        `);
	$('#priorZone').replaceWith(` 
            <div id="priorZone">
            <p></p>
        </div>
        `);
	$('#inventoryZone').replaceWith(` 
        <div id="inventoryZone"><span>Inventory</span></div>
        `);
	$('#seenZone').replaceWith(` 
        <div id="seenZone"><span>Seen</span></div>
        `);
	$('#storyZone').replaceWith(` 
        <div id="storyZone">
            <p id="storyText">You wake up in a strange room with faint memories that someone is coming back to the room to harm you. What do you do?</p>
        </div>  
        `);
	$('#gameOverZone').addClass('hidden');
	guide = {
		inventory                 : [ 'pocket lint' ],
		achievements              : {
			count         : resetVariables.achCount,
			seenItAll     : resetVariables.ach1,
			ifItsBrown    : resetVariables.ach2,
			sentForHelp   : resetVariables.ach3,
			alternateExit : resetVariables.ach4,
			bloodyMary    : resetVariables.ach5,
			frontDoor     : resetVariables.ach6,
			allExits      : resetVariables.ach7,
			orangeYouGlad : resetVariables.ach8,
			itsAMe        : resetVariables.ach9,
			pyromaniac    : resetVariables.ach10,
			dejaVu        : resetVariables.ach11
		},
		priorMessage              : '',
		currentMessage            :
			'You wake up in a strange room with faint memories that someone is coming back to the room to harm you. What do you do?',
		displayText               : '',
		room                      : 'bedroom',
		direction                 : 'west',
		bedroom                   : {
			seen        : true,
			name        : 'bedroom',
			description :
				'The BEDROOM has a BED to the WEST, a DESK to the SOUTH, a DRESSER to the EAST, and a BLUE DOOR to the NORTH.',
			west        : `You are facing WEST. There is a BED and a NIGHT STAND.`,
			north       : `You are facing NORTH. There is a BLUE DOOR, a BANANA POSTER, and a MOVIE POSTER`,
			east        : `You are facing EAST. There is a DRESSER and a MIRROR`,
			south       : `You are facing SOUTH. There is a DESK, a RED DOOR, and a WASTEBIN.`,
			up          : `A CEILING FAN is above you. It has a LIGHT on it that's slowly burning into your retinas`,
			down        : `There is a red, spiral RUG below your feet.`
		},
		bathroom                  : {
			seen        : false,
			name        : 'bathroom',
			description :
				'The BATHROOM has a SINK to the WEST, a BLUE DOOR to the SOUTH, a TUB to the EAST, and a TOILET to the NORTH.',
			west        : `You are facing WEST. There is a SINK and a BATHROOM MIRROR.`,
			north       : `You are facing NORTH. There is a TOWEL RACK and a TOILET.`,
			east        : `You are facing EAST. There is a TUB, a SHOWER CURTAIN, and a BATHROOM WINDOW.`,
			south       : `You are facing SOUTH. There is a BLUE DOOR and a PLANT.`,
			up          : `You look up. There's a BATHROOM LIGHT above you.`,
			down        : `There is a BATH MAT below your feet.`
		},
		bed                       : {
			seen        : false,
			name        : 'bed',
			room        : 'bedroom',
			isMade      : false,
			description : 'The BED has a PILLOW and a BLANKET. It is not made.'
		},
		pillow                    : {
			seen        : false,
			room        : 'bedroom',
			name        : 'pillow',
			description : 'A black and white, fluffy PILLOW.'
		},
		change                    : {
			seen        : false,
			canBeTaken  : true,
			room        : 'bedroom',
			name        : 'change',
			description : 'Some CHANGE adding up to 75 cents'
		},
		matches                   : {
			seen        : false,
			canBeTaken  : true,
			room        : 'bedroom',
			name        : 'matches',
			description : `A box of MATCHES. Don't get any funny ideas.`
		},
		'square key'              : {
			seen        : false,
			canBeTaken  : true,
			room        : 'bedroom',
			name        : 'square key',
			description : `A SQUARE KEY. If only you had a square lock.`
		},

		blanket                   : {
			seen        : false,
			room        : 'bedroom',
			name        : 'blanket',
			description : 'A thick, grey BLANKET.'
		},
		wrench                    : {
			seen        : false,
			canBeTaken  : true,
			room        : 'bedroom',
			name        : 'wrench',
			description : `A silver and heavy WRENCH.`
		},
		'night stand'             : {
			seen        : false,
			name        : 'night stand',
			room        : 'bedroom',
			description : 'A small bedside NIGHT STAND with a BOOK on it.'
		},
		book                      : {
			seen        : false,
			name        : 'book',
			canBeTaken  : true,
			room        : 'bedroom',
			isLocked    : true,
			isOpen      : false,
			description :
				'The BOOK seems to be a diary belonging to someone named Mary. A 4-digit NUMBER LOCK is on the side of it.'
		},
		'number lock'             : {
			seen        : false,
			room        : 'bedroom',
			name        : 'number lock',
			description : 'The NUMBER LOCK has 4-digits on the code. It is currently set to 0000'
		},
		desk                      : {
			seen        : false,
			name        : 'desk',
			room        : 'bedroom',
			description : 'A wooden DESK with a single DESK DRAWER. A POEM sits on top.'
		},
		'desk drawer'             : {
			seen        : false,
			name        : 'desk drawer',
			room        : 'bedroom',
			isLocked    : true,
			description : 'The DESK DRAWER has a diamond-shaped keyhole. It is currently locked.'
		},
		'scribbled note'          : {
			seen        : false,
			name        : 'scribbled note',
			canBeTaken  : true,
			room        : 'bedroom',
			isBurned    : false,
			isBird      : false,
			description : 'The SCRIBBLED NOTE is hard to read, but you manage to read 84**'
		},
		poem                      : {
			seen        : false,
			name        : 'poem',
			canBeTaken  : true,
			room        : 'bedroom',
			isBurned    : false,
			isBird      : false,
			description : `The POEM says, "Pain so severe when we are apart. I miss your wind-blown hair, the key to my heart."`
		},
		'banana poster'           : {
			seen        : false,
			name        : 'banana poster',
			room        : 'bedroom',
			isRemoved   : false,
			description : `A BANANA POSTER. What can I say? It's a poster, and it has a banana.`
		},
		'identical banana poster' : {
			seen        : false,
			name        : 'identical banana poster',
			room        : 'bedroom',
			isRemoved   : false,
			description : 'An IDENTICAL BANANA POSTER. Deja vu.'
		},
		'orange poster'           : {
			seen        : false,
			name        : 'orange poster',
			room        : 'bedroom',
			isRemoved   : false,
			description : 'An ORANGE POSTER. Like the fruit, not the color. But it actually is orange in color, too.'
		},
		'movie poster'            : {
			seen        : false,
			name        : 'movie poster',
			room        : 'bedroom',
			isRemoved   : false,
			description : 'A MOVIE POSTER for a horror film. A creepy woman is looking out from a mirror.'
		},
		'blue door'               : {
			seen        : false,
			name        : 'blue door',
			room        : 'bedroom',
			isOpen      : false,
			isLocked    : true,
			description : 'A wooden BLUE DOOR. Its knob has a heart-shaped keyhole.'
		},
		'red door'                : {
			seen        : false,
			name        : 'red door',
			room        : 'bedroom',
			isOpen      : false,
			isLocked    : true,
			description : 'A wooden RED DOOR. Its knob has a square-shaped keyhole.'
		},
		dresser                   : {
			seen        : false,
			name        : 'dresser',
			room        : 'bedroom',
			description : 'A large, white DRESSER with a TOP DRAWER and a BOTTOM DRAWER.'
		},
		mirror                    : {
			seen        : false,
			name        : 'mirror',
			room        : 'bedroom',
			isBroken    : false,
			description :
				'A shiny MIRROR hanging above the DRESSER. You look at yourself in it. For being in distress, you look really good.'
		},
		'top drawer'              : {
			seen        : false,
			name        : 'top drawer',
			room        : 'bedroom',
			isOpen      : false,
			description : 'A TOP DRAWER of a DRESSER. It is currently shut.'
		},
		'bottom drawer'           : {
			seen        : false,
			name        : 'bottom drawer',
			room        : 'bedroom',
			isOpen      : false,
			description : 'A BOTTOM DRAWER of a DRESSER. It is currently shut.'
		},
		'scrap paper'             : {
			seen        : false,
			name        : 'scrap paper',
			canBeTaken  : true,
			room        : 'bedroom',
			isBurned    : false,
			isBird      : false,
			description : 'The SCRAP PAPER says **15'
		},
		rug                       : {
			seen        : false,
			room        : 'bedroom',
			name        : 'rug',
			description : 'A red, spiral RUG. It covers most of the floor.'
		},
		'ceiling fan'             : {
			seen        : false,
			name        : 'ceiling fan',
			room        : 'bedroom',
			isOn        : false,
			description : 'A 5-bladed CEILING FAN. It is currently off.'
		},
		light                     : {
			seen        : false,
			name        : 'light',
			room        : 'bedroom',
			isOn        : true,
			description : `A LIGHT that's part of the CEILING FAN. It is currently on.`
		},
		'heart key'               : {
			seen        : false,
			name        : 'heart key',
			canBeTaken  : true,
			room        : 'bedroom',
			onRug       : false,
			description : 'A HEART KEY. If only you had a heart lock.'
		},
		'diamond key'             : {
			seen        : false,
			name        : 'diamond key',
			canBeTaken  : true,
			room        : 'bathroom',
			description : 'A DIAMOND KEY. If only you had a diamond lock.'
		},
		wastebin                  : {
			seen        : false,
			name        : 'wastebin',
			room        : 'bedroom',
			description : `A WASTEBIN that's empty except for a RIBBON at the bottom. What a bunch of rubbish.`
		},
		ribbon                    : {
			seen        : false,
			room        : 'bedroom',
			canBeTaken  : true,
			name        : 'ribbon',
			description : 'A small, teal RIBBON.'
		},
		'bath mat'                : {
			seen        : false,
			room        : 'bathroom',
			name        : 'bath mat',
			description : 'Just your average BATH MAT'
		},
		toilet                    : {
			seen        : false,
			name        : 'toilet',
			room        : 'bathroom',
			isOpen      : false,
			isClogged   : true,
			description : `A typical white porcelain TOILET. It looks like someone left behind too much because it's clogged.`
		},
		'bathroom window'         : {
			seen        : false,
			name        : 'bathroom window',
			room        : 'bathroom',
			isOpen      : false,
			isBroken    : false,
			description : `A small BATHROOM WINDOW. It doesn't look like a person could fit through it.`
		},
		pigeon                    : {
			seen        : false,
			name        : 'pigeon',
			room        : 'bathroom',
			flewAway    : false,
			isCarrying  : false,
			description : `A plump PIGEON. As it stares deep into your soul, you have the feeling it wants something from you.`
		},
		sink                      : {
			seen        : false,
			name        : 'sink',
			room        : 'bathroom',
			isOn        : false,
			description : 'A SINK with a CANDLE on top and a CABINET below.'
		},
		cabinet                   : {
			seen        : false,
			name        : 'cabinet',
			room        : 'bathroom',
			isOpen      : false,
			description : `A CABINET below the sink. It's currently closed.`
		},
		plant                     : {
			seen        : false,
			name        : 'plant',
			room        : 'bathroom',
			description : `A fake PLANT. At least it can't be killed.`
		},
		'towel rack'              : {
			seen        : false,
			name        : 'towel rack',
			room        : 'bathroom',
			description : 'A simple TOWEL RACK. Nothing special about it.'
		},
		'bathroom light'          : {
			seen        : false,
			name        : 'bathroom light',
			room        : 'bathroom',
			isOn        : true,
			description : 'A dim BATHROOM LIGHT on the ceiling.'
		},
		'shower curtain'          : {
			seen        : false,
			name        : 'shower curtain',
			room        : 'bathroom',
			isClosed    : false,
			description : `A leaf-printed SHOWER CURTAIN. It looks nice but doesn't seem to be helpful.`
		},
		tub                       : {
			seen        : false,
			name        : 'tub',
			room        : 'bathroom',
			isOn        : false,
			description : 'A claw-footed TUB with a TUB NOZZLE and a DIVERTER. A SHOWER NOZZLE is above.'
		},
		'tub nozzle'              : {
			seen        : false,
			name        : 'tub nozzle',
			room        : 'bathroom',
			description : 'A brass TUB NOZZLE.'
		},
		diverter                  : {
			seen            : false,
			name            : 'diverter',
			room            : 'bathroom',
			currentPosition : 'down',
			description     : `A brass DIVERTER. It's currently in the down position.`
		},
		'shower nozzle'           : {
			seen        : false,
			name        : 'shower nozzle',
			room        : 'bathroom',

			isFixed     : false,
			description : 'A brass SHOWER NOZZLE. Something seems off about it.'
		},
		candle                    : {
			seen        : false,
			name        : 'candle',
			room        : 'bathroom',
			isLit       : false,
			description : `A large black CANDLE. It doesn't seem to be scented.`
		},
		'bathroom mirror'         : {
			seen        : false,
			name        : 'bathroom mirror',
			room        : 'bathroom',
			isBroken    : false,
			description :
				'An antique BATHROOM MIRROR. As you look into it, you almost feel like someone is watching you.'
		},
		plunger                   : {
			seen        : false,
			name        : 'plunger',
			canBeTaken  : true,
			room        : 'bathroom',
			description : 'A black PLUNGER.'
		},
		'pocket lint'             : {
			seen        : true,
			name        : 'pocket lint',
			room        : 'inventory',
			description : 'Some POCKET LINT to remind you that your inventory exists. Serves no other purpose in life.'
		}
	};
}
