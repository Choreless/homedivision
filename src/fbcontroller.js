import firebase from 'firebase';

// handles all writing to firebase
let fbcontroller = {
// jimmy's calls (wekkly view updates mainly chore cards)

    // adds chore card for the given chore to the given group
    addChoreCard: (group, chore) => {
        //default values
        let vals = {
            isResizeable: boolean = false,
            x: number = 0,
            y: number = Infinity,
            color: string = "#fff",
            user: string = "",
            w: number = 1,
            h: number = 2
        }
        
        // creates new card in firebase and returns key
        var newCardKey = firebase.database().ref('groups/' + group + '/layout').push(); 

        // populates card with default info
        firebase.database().ref('groups/' + group + '/layout/' + newCardKey).set({
            color: vals.color,
            owner: vals.user,
            x: vals.x,
            y: vals.y,
            w: vals.w,
            h: vals.h,
            chore: chore,
            isResizeable: vals.isResizeable
        }, (error) => {
            console.log(error.message);
        });
    },
    // takes in a card number and updates its color and position and user for the given group id
    updateChoreCard: (group, card, color, pos, user) => {
        firebase.database().ref('groups/' + group + '/layout/' + card).update({
            color: color,
            owner : user,
            x: pos
        }, (error) => {
            console.log(error.message);
        });
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
    updateGroupName: (group, name) => {
        firebase.database().ref('groups/' + group).update({
            name: name
        }, (error) => {
            console.log(error.message);
        });
    },
    
    // adds a chore with description
    addChore: (group, description) => {
        var newChoreKey = firebase.database().ref('groups/' + group + '/chores').push(); 
        firebase.database().ref('groups/' + group + '/chores/' + newChoreKey).set(description, 
        (error) => {
            console.log(error.message);
        });
    },

// albert's stuff (user settings)

    // updates name and color for given user
    updateUserInfo: (user, name, color) => {
        firebase.database().ref('users/' + user).update({
            handle: name,
            color: color
        }, (error) => {
            console.log(error.message);
        });
    },

    // updates email and password for given user
    updateUserLoginInfo: (email, password) => {

    }

// Jeff's stuff (add if you need anything buddy)

}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export default fbcontroller;