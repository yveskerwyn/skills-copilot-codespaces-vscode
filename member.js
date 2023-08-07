function skillsmember() {
    var skills = ['html', 'css', 'js', 'php', 'mysql'];
    var member = {
        name: 'John',
        age: 20,
        skills: skills,
        address: {
            city: 'Ha Noi',
            country: 'Viet Nam'
        }
    };
    console.log(member.skills[1]);
    console.log(member.address.city);
}

