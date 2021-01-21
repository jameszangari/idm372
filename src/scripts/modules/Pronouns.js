const list = [
    // !!! Don't change order !!! Only add below
    "Prefer not to say",
    "He/His",
    "She/Her",
    "They/Them",
    "Queer/Other",
]

module.exports = {
    getPronoun: function (value) { // Send back pronoun string
        return list[value];
    },
    list: list
}