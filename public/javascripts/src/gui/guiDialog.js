/*
	dialogs block input from the frame behind it, as well as the game layer,
	but display over everything else instead of replacing anything.

	we need a couple of different types of dialogs.

	1) a dialog for displaying the post-level screen
		name level
		enter username and password
		confirm & cancel buttons

		'SubmitDialog'

	2) a success/fail dialog
		okay button
		information
		to be used after posting a level
			to confirm or deny that it was posted
			this means it could be overlaid over the other dialog
		to also be used after either failing a level or suceeding

		'ConfirmDialog'

	3) a story dialog
		has some 'story' information
		could also be used for tutorial information
		probably using pictures in this.

		'InfoDialog'

*/

App.GuiSubmitDialog = function(){

}

App.GuiConfirmDialog = function(){

}

App.GuiInfoDialog = function(){

}