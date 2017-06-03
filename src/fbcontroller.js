import firebase from 'firebase';

// handles all writing to firebase
let fbcontroller = {
// jimmy's calls (wekkly view updates mainly chore cards)

    // adds chore card for the given chore to the given group
    addChoreCard: (group, chore) => {
        //default values
        let vals = {
            isResizeable: false,
            x: 0,
            y: Infinity,
            color: "#fff",
            user: "",
            w: 1,
            h: 2
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
        });
    },
    // takes in a card number and updates its color and position and user for the given group id
    updateChoreCard: (group, card, color, pos, user) => {
        firebase.database().ref('groups/' + group + '/layout/' + card).update({
            color: color,
            owner : user,
            x: pos
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
        });
    },
    
    // updates chore list with given list
    updateChores: (group, newChores) => {
        firebase.database().ref('groups/' + group).update({chores: newChores});
    },

    removeMemberFromGroup: (group, member) => {
        firebase.database().ref('groups/' + group + '/members').once('value').then((snapshot) => {
            var currentMembers = snapshot.val();
            var newMembers = [];

            currentMembers.forEach((currentMember) => {
                if(currentMember != member){
                    newMembers.push(currentMember);
                }
            });

            firebase.database().ref('groups/' + group).update({
                members: newMembers
            }).then(() => {  
                firebase.database().ref('users/' + member).update({
                    group: false
                })
            }).catch((err) =>{
                alert('Error occured', err);
            })            
        });
    },

// albert's stuff (user settings)

    // updates name, color, email for given user
    updateUserInfo: (user, name, color, email) => {
        firebase.database().ref('users/' + user).update({
            handle: name,
            color: color,
            email: email
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