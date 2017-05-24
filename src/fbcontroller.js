import firebase from 'firebase';

// handles all writing to firebase
let fbcontroller = {
// jimmy's calls (wekkly view updates mainly chore cards)

    // adds chore card for the given chore
    addChoreCard: (chore) => {
        //default values
        isResizeable = false;
        x = 0;
        y = Infinity;
        color = #fff;
        user = "";
        w = 1;
        h = 2;
    },
    // takes in a card number and updates its color and position and user
    updateChoreCard: (card, color, pos, user) => {

    },

// isaac's stuff (join/create group)

    // takes in user given name for group and will generate a passcode
    createGroup: (name) => {

    },
    // add userid to group using groupid
    addUserToGroup: (user, group) => {

    },

// thomas' stuff (group settings)
    
    // updates group name to given name
    updateGroupName: (name) => {

    },
    
    // adds a chore with description
    addChore: (description) => {

    },

// albert's stuff (user settings)

    // updates name and color for current user
    updateUserInfo: (name, color) => {

    },

    // updates email and password for current user
    updateUserLoginInfo: (email, password) => {

    }

// Jeff's stuff (add if you need anything buddy)

}

export default fbcontroller;