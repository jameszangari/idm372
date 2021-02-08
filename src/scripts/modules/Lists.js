// ===============
// Lists
// ===============

// The order of these lists is the order they will be displayed, you can change the order but...
// The object keys ('a' 'b' etc.) are the identifers, NEVER change those

const genders = {
    'a': 'Prefer not to say',
    'b': 'Male',
    'c': 'Female',
    'd': 'Gender Queer/Other'
}

const pronouns = {
    'a': 'Prefer not to say',
    'b': 'He/His',
    'c': 'She/Her',
    'd': 'They/Them',
}

const looking_for = {
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

module.exports = {
    decipherCode: function (list, index) {
        // list param is the name of the list
        // index param is the key/identifier of the list
        // Ex. decipherCode('genders', 'c') returns 'Female'
        return this[list][index];
    },
    lists: {
        pronouns: pronouns,
        genders: genders,
    }
}