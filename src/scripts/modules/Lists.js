// ===============
// Lists
// ===============

// The order of these lists is the order they will be displayed, you can change the order but...
// The object keys ('a' 'b' etc.) are the identifers, NEVER change their values to something different than it's meaning
// Ex. You can change 'a': 'Prefer not to say' to 'a': 'I'd rather not say', but do not change it to 'a': 'Male'

const lists = {
    genders: {
        'a': 'Prefer not to say',
        'b': 'Male',
        'c': 'Female',
        'd': 'Gender Queer/Other'
    },
    pronouns: {
        'a': 'Prefer not to say',
        'b': 'He/His',
        'c': 'She/Her',
        'd': 'They/Them',
    },
    looking_for: {
        'a': 'Band mates',
        'b': 'Make friends',
        'c': 'Concert buddies',
        'd': 'Chats',
        'e': 'New music',
        'f': 'Local music',
        'g': 'Jam buddies',
        'h': 'Music discussion',
        'i': 'Not sure yet',
    }
}

module.exports = {
    lists: lists,
    decipherCodes: function (list, codeString) { // Returns a string where all codes are replaced with their meaning
        if (codeString == undefined) return;
        if (codeString.includes(',')) { // If more than one in the list
            const codesArray = codeString.split(', ');
            const newArray = [];

            codesArray.forEach(code => {
                newArray.push(lists[list][code]);
            });

            console.log(newArray);
            const newString = newArray.join(', ');
            return newString;
        } else { // If just one in the list
            return lists[list][codeString];
        }
    }
}