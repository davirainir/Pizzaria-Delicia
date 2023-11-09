// Definindo variáveis que representam elementos HTML
document.addEventListener('DOMContentLoaded', function () { // evento que escuta quando o DOM da página foi completamente carregado
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentOption = document.getElementById('select_payment');
    const deliveryOption = document.getElementById('select_delivery');
    const customerAddress = document.getElementById('input_address');
    const customerTroco = document.getElementById('input_troco')
    const Address = document.getElementById('address');
    const Troco = document.getElementById('troco')
    const clientNameInput = document.getElementById('client_name');
    const semTroco = document.getElementById('input_radio_troco')

    let cart = []; // variável que será usada para armazenar os items do carrinho

    // Função para atualizar o carrinho
    function updateCart() {
        cartItemsList.innerHTML = ''; // limpa o conteúdo anterior da lista de itens no carrinho
        let total = 0; // inicializa a variável com valor zero
        const itemDetails = []; // constante que será usada para armazenar os detalhes de cada item do carrinho

        cart.forEach((item, index) => {
            const li = document.createElement('li'); //  para cada item no carrinho, esta linha cria um novo elemento <li>
            li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)}`; // define como o nome e preço do item serão mostrados
            
            // Botão para excluir o item
            const deleteButton = document.createElement('button'); // cria o elemento
            deleteButton.textContent = 'Excluir'; // nome do botão
            deleteButton.classList.add('cart-button', 'delete'); // adiciona classes
            deleteButton.addEventListener('click', () => removeFromCart(index)); // adiciona um evento de click

            li.appendChild(deleteButton); // adiciona o botão delete a const "li"

            cartItemsList.appendChild(li); // adiciona a const "li" na variável "cartItemsList"
            total += item.price;
            itemDetails.push(`*${item.name}: R$${item.price.toFixed(2)}*`);
        });

        cartTotal.textContent = `R$ ${total.toFixed(2)}`; // define o texto do total do carrinho
        return itemDetails;
    }

    // Botão de adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name'); // retorna o valor do atributo data-name
            const price = parseFloat(this.getAttribute('data-price')); // retorna o valor do atributo com número decimal
            cart.push({ name, price }); // adiciona no carrinho
            updateCart(); // atualiza o carrinho
        });
    });

    // Função para remover item do carrinho usada pelo botão "Excluir item"
    function removeFromCart(index) {
        cart.splice(index, 1);// remove um elemento do array "cart"
        updateCart(); // atualiza o carrinho
    }

    // Evento ouvinte para o select do Tipo de entrega
    deliveryOption.addEventListener("change", function () {
        if (deliveryOption.value === "Entregar no Endereço") {
            Address.style.display = "block";  // Mostra o input de texto do endereço de entrega
        } else {
            Address.style.display = "none"; // Esconde o input de texto do endereço de entrega
        }
    });
    
    // Evento ouvinte para o select do tipo de pagamento
    paymentOption.addEventListener("change", function(){
        if (paymentOption.value === "Dinheiro") {
            Troco.style.display = "block"; // Mostra o input de troco
        } else {
            Troco.style.display = "none"; // Esconde o input de troco
        }
    });

    // Evento ouvinte para a checkbox do troco
    semTroco.addEventListener('change', function () {
        if (semTroco.checked && customerTroco.value.trim() != '') {
            alert('Você marcou "Sem troco" e inseriu um valor de troco. Por favor, remova o valor de troco.');
            customerTroco.value = ''; // Limpa o valor do campo de troco
            semTroco.checked = false; // Desmarca a opção "Sem troco"
        } else if (semTroco.checked){
            customerTroco.disabled = true; // Desabilita a opção de "troco" caso a opção "sem troco" estiver marcada
        } else {
            customerTroco.disabled = false; // Habilita a opção de "troco" caso a opção "sem troco" NÃO esteja marcada
        }
    });

    // Botão de finalizar compra
    checkoutButton.addEventListener('click', function () {
        if (cart.length > 0) {
            // Definindo variáveis dos valores dos inputs
            const payment = paymentOption.value;
            const delivery = deliveryOption.value;
            const address = customerAddress.value;
            const troco = customerTroco.value
            const total = parseFloat(cartTotal.textContent.replace('R$', '')); // remove o símbolo "R$" do texto e converte em um número com casas decimais
            const clientName = clientNameInput.value;

            // Obtenha a lista de detalhes dos itens do carrinho
            const itemDetails = updateCart();

            // Construa a mensagem para o WhatsApp
            let mensagemWhatsApp = `Pedido de *${clientName.toUpperCase()}:*\n`;

            // Adicione os detalhes dos itens do carrinho à mensagem
            itemDetails.forEach((item) => {
                mensagemWhatsApp += `- ${item}\n`;
            });
            
            // monta a mensagem do whatsapp
            mensagemWhatsApp += `\nTotal: *R$${total.toFixed(2)}*\nTipo de Pagamento: *${payment}*\nTipo de Entrega: *${delivery}*`;
            
            // Adiciona o calculo do troco na mensagem do whatsapp
            if ( delivery != "Entregar no Endereço" && troco > total){
                const troco_formatado = (troco - total).toFixed(2);
                mensagemWhatsApp += `\nTroco: *R$${troco_formatado}*`;
            }
            // Mensagem de troco inválido, caso o troco seja menor que o total
             else if (payment === "Dinheiro" && troco < total && semTroco.checked == false){
                alert('Troco inválido, por favor insira um troco adequado.')
                return;
            }
            // Adiciona o endereço do cliente na mensagem do whatsapp
             else if (delivery === "Entregar no Endereço" && troco > total && address != '') {
                const troco_formatado = (troco - total).toFixed(2);
                mensagemWhatsApp += `\nEndereço de Entrega: *${address}*\nTroco: *R$${troco_formatado}*`
            } 
            // Mensagem de erro, caso a opção "Entregar no Endereço" seja escolhida e o endereço não seja informado                
            else if (delivery === "Entregar no Endereço" && address === ''){
                alert('O endereço não foi informado, por favor digite o endereço.');
                return;
            } 
            // Verifique se o campo de nome está vazio
            else if (clientName.trim() === '') {
                alert('Por favor, insira seu nome antes de finalizar a compra.');
                return; // Impede a conclusão da compra
            }

            // Número de telefone para o qual você deseja enviar a mensagem (no formato internacional)
            const numeroTelefone = "5585998006527";

            // Construir a URL do WhatsApp com o número de telefone e a mensagem
            const urlWhatsApp = "https://api.whatsapp.com/send?phone=" + numeroTelefone + "&text=" + encodeURIComponent(mensagemWhatsApp);

            // Abre uma nova aba no navegador para o WhatsApp
            window.open(urlWhatsApp, "_blank");

            cart = []; // Remove os items do carrinho após o pedido
            updateCart(); // Atualiza o carrinho
        } else {
            alert('Carrinho vazio. Adicione itens antes de finalizar o pedido.'); // mostra uma mensagem de "carrinho vazio" caso o carrinho esteja vazio
        }
    });
});