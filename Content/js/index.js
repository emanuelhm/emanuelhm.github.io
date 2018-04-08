$(function () {

    //------------------------------------//
    //Navbar//
    //------------------------------------//
    var menu = $('.navbar');
    $(window).bind('scroll', function (e) {
        if ($(window).scrollTop() > 140) {
            if (!menu.hasClass('open')) {
                menu.addClass('open');
            }
        } else {
            if (menu.hasClass('open')) {
                menu.removeClass('open');
            }
        }
    });


    //------------------------------------//
    //Scroll To//
    //------------------------------------//
    $(".scroll").click(function (event) {
        event.preventDefault();
        $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 800);

    });

    //------------------------------------//
    //Wow Animation//
    //------------------------------------// 
    wow = new WOW(
        {
            boxClass: 'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 0,          // distance to the element when triggering the animation (default is 0)
            mobile: false        // trigger animations on mobile devices (true is default)
        }
    );
    wow.init();

    $("#RegisterForm").validate({
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            Nome: {
                required: true,
                minlength: 3,
                maxlength: 40
            },
            Sobrenome: {
                required: true,
                minlength: 3,
                maxlength: 40
            },
            Email: {
                required: true,
                email: true,
                maxlength: 40,
                minlength: 10
            },
            ConfirmarEmail: {
                required: true,
                equalTo: '#Email'
            },
            DataNascimento: {
                required: true,
                date: true,
                pastDate: true,
            },
            Senha: {
                required: true,
                maxlength: 50
            },
            ConfirmarSenha: {
                required: true,
                equalTo: "#Senha"
            },
            Sexo: {
                required: function (element) {
                    return $("#Sexo").val() === "M" || $("#Sexo").val() === "F";
                }
            }
        },
        messages: {
            ConfirmarEmail: {
                equalTo: "Os emails não são iguais."
            },
            ConfirmarSenha: {
                equalTo: "As senhas não são iguais."
            },
            DataNascimento: {
                required: "Data de nascimento inválida."
            },
            Sexo: {
                required: "Digite um gênero válido."
            }
        },
        submitHandler: function () {
            sessionStorage.setItem("cor", $("#Cor").val());
            window.location.href = "file:///C:/Users/EMANUELHIROSHIMIYAGA/Desktop/emanuelhm.github.io/inicio.html";
        }
    });

    $("#LoginForm").validate({
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            LoginEmail: {
                required: true,
                email: true,
                maxlength: 40
            },
            LoginSenha: {
                required: true,
                maxlength: 50
            }
        }
    });
});
