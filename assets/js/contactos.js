$(document).ready(function() {
    // Event Listener de on-click do 'Submeter'
    $("#contact-form").on("submit", function(event) {
        // Previne o comportamento padrão de submissão
        event.preventDefault();

        // Limpa as mensagens de erro e sucesso anteriores
        clearMessages();

        // Verifica se o formulário é válido
        if (validateForm()) {

            // Dados do formulário já validados
            var formData = {
                name: $('#name').val(),
                email: $('#email').val(),
                message: $('#message').val(),
            };

            // Armazena os dados no localStorage
            localStorage.setItem('formData', JSON.stringify(formData));

            // Exibe a mensagem de sucesso
            $("#success-message").fadeIn().delay(5000).fadeOut();

        } 
        
        // Mensagem de Erro
        else {
            $("#error-message").fadeIn().delay(5000).fadeOut();
        }
    });

    // Função para limpar as mensagens
    function clearMessages() {
        // Limpa mensagens de erro
        $("#name-error").hide();
        $("#email-error").hide();
        $("#message-error").hide();

        // Limpa mensagens de sucesso e erro
        $("#success-message").hide();
        $("#error-message").hide();
    }

    // Função de validação do formulário
    function validateForm() {
        let isValid = true;

        // Inputs do Formulário
        let nameInput = $("#name");
        let emailInput = $("#email");
        let textMessage = $("#message");

        // Validação do nome (Mínimo de 3 caracteres)
        if (nameInput.val().length < 3) {
            $("#name-error").show();
            isValid = false;
        }

        // Validação do e-mail (não pode estar vazio)
        if ($.trim(emailInput.val()) === "") {
            $("#email-error").show();
            isValid = false;
        }

        // Validação da mensagem (não pode estar vazia)
        if ($.trim(textMessage.val()) === "") {
            $("#message-error").show();
            isValid = false;
        }

        return isValid;
    }
});
