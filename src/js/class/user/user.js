export class User {
    constructor(){}

    saveUserInfo(user) {
        sessionStorage.setItem('userInfo', user)
    }

    printUser(user) {
        $('#userInfo').text(user);
        $('#userImage').remove();
    }

    getDataUser() {
        let user = sessionStorage.getItem('userInfo');
        (user) ? this.printUser(user) : $("#staticBackdrop").modal('show');
    }

    validateModalUser(){    
        let user = $('#userName').val().trim();
    
        if(user && user.length){
            $("#userName").removeClass( 'is-invalid' );
            $("#userHelp").fadeOut(500);
        }
    }
}