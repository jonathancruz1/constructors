var fs = require("fs");
var inquirer = require("inquirer");

"use strict";

//Basic Card Function
function BasicCard (front, back) {
	if (!(this instanceof BasicCard)) {
		return new BasicCard (front, back);
	}
	this.front = front;
	this.back = back;
};

//Function that displays question
BasicCard.prototype.displayBasicCard = function() {
	console.log("Question: " + this.front + "\nAnswer(Back): " + this.back);
};

//Cloze Card Function
function ClozeCard (text, cloze) {
	if (!(this instanceof ClozeCard)) {
		return new CloseCard (text, cloze);
	}
	this.text = text;
	this.cloze = cloze;
	this.partial = text.replace(cloze, "__________");
}

//Function that displays full text
ClozeCard.prototype.displayFullText = function() {
	console.log("Full Text: " + this.text);
}

//Function that displays cloze text
ClozeCard.prototype.displayClozeText = function () {
	console.log("Cloze: " + this.cloze);
}

//Function that displays partial text
ClozeCard.prototype.displayPartialText = function () {
	console.log("Partial Text: " + this.partial);
}

startFlashcard();

//Starting Flashcard
function startFlashcard() {
	inquirer.prompt([{
		name: "confirm",
		type: "rawlist",
		message: "Are you ready to generate a new flashcard?",
		choices: ["Yes", "No"]
	}]).then(function(response) {
		var confirm = response.confirm;

		if(confirm === "Yes") {
			playFlashcard();
		} else if (confirm === "No") {
			console.log("Come back when you're ready!");
			return;
		}
	});
}

//Playing Flashcard Function
function playFlashcard() {
	inquirer.prompt([{
		name: "cardType",
		type: "rawlist",
		message: "Select your flashcard type",
		choices: ["Basic Flashcard", "Cloze Flashcard"]
	}]).then (function(response) {
		var cardType = response.cardType;
		if(cardType === "Basic Flashcard") {
			basicQuestion();
		} else {
			clozeQuestion();
		}
	})
}

//Function for entering question to basic flashcard
function basicQuestion() {
	inquirer.prompt([{
		name: "front",
		type: "input",
		message: "Enter your question: "
	},{
		name: "back",
		type: "input",
		message: "Enter your answer: "
	}]).then(function(basic){

		var basicFlashcard = new BasicCard(basic.front, basic.back);
		console.log("You have added a new basic flashcard.");
		console.log("--------------------");
		basicFlashcard.displayBasicCard();
		console.log("--------------------");
		
		//add new question to my basicard.json file
		fs.appendFile("basiccard.json", JSON.stringify(basicFlashcard) + "\n" , function(err)  {
			if (err) throw err;	
		})
	})
}

//Function for entering question to cloze flashcard
function clozeQuestion() {
	inquirer.prompt([{
		name: "text",
		type: "input",
		message: "Enter your full statement: "
	}, {
		name: "cloze",
		type: "input",
		message: "Chose your Cloze word: ",
		validate: function (value) {
	       if (value.length) {
	         return true;
	       } else {
	         console.log('Try again.');
	       }
     }
	}]).then(function(cloze) {

   		var clozeFlashcard = new ClozeCard(cloze.text, cloze.cloze);
		console.log("You have added a new cloze flashcard.");
		console.log("--------------------");
		clozeFlashcard.displayPartialText();
		clozeFlashcard.displayClozeText();
		clozeFlashcard.displayFullText();
		console.log("---------------------");

		//add new statement to my clozecard.json file
		fs.appendFile("clozecard.json", JSON.stringify(clozeFlashcard) + "\n", function(err){
			if(err) throw err;
		});
	});
}