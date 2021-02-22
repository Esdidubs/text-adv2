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

// Hides achievements if not earned
function hideAchievements(resetVariables){
	for (let achievement in resetVariables){		
		if(resetVariables[achievement] === false){
			$(`.`+ achievement).hide();
		}
	}
}

// updates inventory to show anything held
function inventorySetup() {
	let itemList = [];
	for (let item in guide.inventory) {
		itemList.push(guide.inventory[item]);
	}
	let invCount = itemList.length;
	let itemString = itemList.join(', ');

	$('#inventoryZone').html(`<span>Inventory (${invCount})</span><div class="inventoryItem">${itemString}</div> `);
};

// updates all items seen
function displaySeen() {
	let itemList = [];
	for (let item in guide) {
		if (guide[item].seen === true) itemList.push(guide[item].name);
	}
	let invCount = itemList.length;
	let itemString = itemList.join(', ');

	$('#seenZone').html(`<span>Seen Items (${invCount}/52)</span><div class="seenItem">${itemString}</div>`);

	if (invCount === 52) {
		if (guide.achievements.seenItAll === false) {
			guide.achievements.seenItAll = true;
			guide.achievements.count++;
			$('#achievement-count').text(guide.achievements.count);
			$('#achievement-seenItAll').show();
		}
	}
}

// Handle color change
function colorChange(color, style1, style2){
	$('body').css(style1, $('#' + color).val());
	$('#helpBox').css(style1, $('#' + color).val());
	$('button').css(style2, $('#' + color).val());
}

// allows buttons to work. Using main for onclick because main always exists
function buttons() {
	$('main').on('click', '#actionBtn', function() {
		event.preventDefault();
		let userChoice = $('#actionInput').val();
		$('#actionInput').val('');
		if (userChoice.replace(/\s/g, '') === '') {
		} else {
			userChoice = userChoice.replace(/[.,\/#!$%\^&\*;@:{}=\-_`~()]/g, '');
			userChoice = userChoice.toLowerCase().split(' ');

			interpretString(userChoice);
		}
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
		$('.achievement').hide();
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

	$('main').on('click', '#settings', function() {
		event.preventDefault();
		$('#helpBox').show();
	});

	$('main').on('click', '#exit', function() {
		event.preventDefault();
		$('#helpBox').hide();
	});

		// background color, font color
	$('#bg-color').change(function() {
		colorChange(this.id, 'background-color', 'color');		
	});

	$('#font-color').change(function() {
		colorChange(this.id, 'color', 'background-color');
	});
}

// sets current text to the prior so user remembers last message
function setPrior() {
	guide.priorMessage = guide.currentMessage;
	$('#priorZone').html(`<p>${guide.priorMessage}</p>`);
}

// updates the current message to respond to user
function setCurrent() {
	$('#storyZone').html(`<p id="storyText">${displayText}</p>`);
	guide.currentMessage = displayText;
}

// removes zones and unhides game over
function gameOver() {
	$('#inputZone').html(``);
	$('#priorZone').html(``);
	$('#inventoryZone').html(``);
	$('#seenZone').html(``);
	$('#gameOverZone').show();
}

// used to explain an item or room using its description
function describe(item) {
	if (guide[item] === undefined) {
		setPrior();
		$('#storyZone').html(`<p id="storyText">I'm not sure what you're asking me to describe. Try again.</p>`);
	} else {
		if (item === 'room' || item === 'bedroom' || item === 'bathroom') {
			if ((item === 'room' || item === 'bedroom') && guide.room === 'bedroom') {
				guide.bed.seen = true;
				guide.desk.seen = true;
				guide.dresser.seen = true;
				guide['blue door'].seen = true;
				displaySeen();
				setPrior();
				displayText = guide[guide.room].description;
				setCurrent();
			} else if ((item === 'room' || item === 'bathroom') && guide.room === 'bathroom') {
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
			if (guide[item].seen === true) {
				lookAtItem(item);
			} else {
				seeError();
			}
		}
	}
}

// used to explain an item using its description
function lookAtItem(item) {
	if (guide[item].room === guide.room || guide[item].room === 'inventory') {
		setPrior();
		displayText = guide[item].description;
		setCurrent();
		if (item === 'bed') {
			guide.pillow.seen = true;
			guide.blanket.seen = true;
		} else if (item === 'night stand') {
			guide.book.seen = true;
		} else if (item === 'book') {
			guide['number lock'].seen = true;
		} else if (item === 'desk') {
			guide['desk drawer'].seen = true;
			guide.poem.seen = true;
		} else if (item === 'dresser') {
			guide['top drawer'].seen = true;
			guide['bottom drawer'].seen = true;
		} else if (item === 'sink') {
			guide.cabinet.seen = true;
			guide.candle.seen = true;
		} else if (item === 'tub') {
			guide['tub nozzle'].seen = true;
			guide['shower nozzle'].seen = true;
			guide.diverter.seen = true;
		} else if (item === 'wastebin') {
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
	if (newDir === 'left') {
		guide.direction === 'west'
			? (newDir = 'south')
			: guide.direction === 'south'
				? (newDir = 'east')
				: guide.direction === 'east' ? (newDir = 'north') : (newDir = 'west');
	} else if (newDir === 'right') {
		guide.direction === 'west'
			? (newDir = 'north')
			: guide.direction === 'north'
				? (newDir = 'east')
				: guide.direction === 'east' ? (newDir = 'south') : (newDir = 'west');
	}
	if (!(guide[guide.room][newDir] === undefined)) {
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
	if (guide.room === 'bedroom') {
		if (guide.direction === 'west') {
			guide.bed.seen = true;
			guide['night stand'].seen = true;
		} else if (guide.direction === 'north') {
			guide['blue door'].seen = true;
			guide['banana poster'].seen = true;
			guide['movie poster'].seen = true;
		} else if (guide.direction === 'east') {
			guide.dresser.seen = true;
			guide.mirror.seen = true;
		} else if (guide.direction === 'south') {
			guide.desk.seen = true;
			guide['red door'].seen = true;
			guide.wastebin.seen = true;
		} else if (guide.direction === 'up') {
			guide['ceiling fan'].seen = true;
			guide.light.seen = true;
		} else if (guide.direction === 'down') {
			guide.rug.seen = true;
		}
	} else {
		if (guide.direction === 'west') {
			guide.sink.seen = true;
			guide['bathroom mirror'].seen = true;
		} else if (guide.direction === 'north') {
			guide['towel rack'].seen = true;
			guide.toilet.seen = true;
		} else if (guide.direction === 'east') {
			guide.tub.seen = true;
			guide['shower curtain'].seen = true;
			guide['bathroom window'].seen = true;
		} else if (guide.direction === 'south') {
			guide.plant.seen = true;
			guide['blue door'].seen = true;
		} else if (guide.direction === 'up') {
			guide['bathroom light'].seen = true;
		} else if (guide.direction === 'down') {
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
	if (!(guide[item] === undefined)) {
		if (guide[item].seen === true) {
			if (guide[item].room === guide.room) {
				setPrior();
				if (guide[item].canBeTaken === true) {
					displayText = `You took the ${item}`;
					guide[item].canBeTaken = false;
					guide[item].room = 'inventory';
					guide.inventory.push(item);
					inventorySetup();
					if (item === 'book') {
						guide['night stand'].description = `A small bedside NIGHT STAND.`;
					} else if (item === 'poem') {
						guide.desk.description = `A wooden DESK with a single DESK DRAWER.`;
					} else if (item === 'ribbon') {
						guide.wastebin.description = `A WASTEBIN that's empty. What a bunch of rubbish.`;
					} else if (item === 'heart key') {
						guide.rug.description = 'A red, spiral RUG. It covers most of the floor.';
						guide.bedroom.down = `There is a red, spiral RUG below your feet.`;
					} else if (item === 'plunger') {
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
	if (guide['banana poster'].isRemoved === false && guide['movie poster'].isRemoved === false) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, a BANANA POSTER, and a MOVIE POSTER`;
	} else if (guide['banana poster'].isRemoved === false && guide['movie poster'].isRemoved === true) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, a BANANA POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['banana poster'].isRemoved === true &&
		guide['identical banana poster'].isRemoved === false &&
		guide['movie poster'].isRemoved === true
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an IDENTICAL BANANA POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['orange poster'].isRemoved === false &&
		guide['identical banana poster'].isRemoved === true &&
		guide['movie poster'].isRemoved === true
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an ORANGE POSTER, and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (guide['orange poster'].isRemoved === true && guide['movie poster'].isRemoved === true) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR and a splatter of blood where a MOVIE POSTER used to be.`;
	} else if (
		guide['banana poster'].isRemoved === true &&
		guide['identical banana poster'].isRemoved === false &&
		guide['movie poster'].isRemoved === false
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an IDENTICAL BANANA POSTER, and a MOVIE POSTER.`;
	} else if (
		guide['orange poster'].isRemoved === false &&
		guide['identical banana poster'].isRemoved === true &&
		guide['movie poster'].isRemoved === false
	) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR, an ORANGE POSTER, and a MOVIE POSTER.`;
	} else if (guide['orange poster'].isRemoved === true && guide['movie poster'].isRemoved === false) {
		guide.bedroom.north = `You are facing NORTH. There is a BLUE DOOR and a MOVIE POSTER.`;
	}
}

// user inputs something not accounted for
function errorMessage() {
	setPrior();
	$('#storyZone').html(`<p id="storyText">I don't understand what you want from me. Try inputting something else.</p>`);
}

// user hasn't seen an item they try to interact with
function seeError() {
	setPrior();
	$('#storyZone').html(`<p id="storyText">I don't think you've seen that item. Try again or look around the room for it first.</p>`);
}

// user interacts with something in another room
function wrongRoomError() {
	setPrior();
	$('#storyZone').html(`<p id="storyText">It doesn't look like that item is in the room.</p>`);
}