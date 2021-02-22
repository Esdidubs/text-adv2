// resets the dom and establishes the guide variable
function resetGame(resetVariables) {
	$('#inputZone').html(`<input type="text" id="actionInput" name="actionInput"><button id="actionBtn">Go</button>`);
	$('#priorZone').html(``);
	$('#inventoryZone').html(`<span>Inventory</span>`);
	$('#seenZone').html(`<span>Seen</span>`);
	$('#storyText').text(`You wake up in a strange room with faint memories that someone is coming back to the room to harm you. What do you do?`);
	$('#helpBox').hide();
	$('#gameOverZone').hide();
	hideAchievements(resetVariables);
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