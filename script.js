document.addEventListener('DOMContentLoaded', function () {
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

    let cart = [];

    // Função para atualizar o carrinho
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;
        const itemDetails = [];

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)}`;
            
            // Adiciona um botão para excluir o item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('cart-button', 'delete');
            deleteButton.addEventListener('click', () => removeFromCart(index));

            li.appendChild(deleteButton);

            cartItemsList.appendChild(li);
            total += item.price;
            itemDetails.push(`${item.name} - R$ ${item.price.toFixed(2)}`);
        });

        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        return itemDetails;
    }

    // Adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            cart.push({ name, price });
            updateCart();
        });
    });

    // Remover item do carrinho
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    // Evento ouvinte para o select do Tipo de entrega
    deliveryOption.addEventListener("change", function () {
        if (deliveryOption.value === "Entregar no endereço") {
            // Mostra o input de texto do endereço de entrega
            Address.style.display = "block";
        } else {
            // Esconde o input de texto do endereço de entrega
            Address.style.display = "none";
        }
    });
    
    // Evento ouvinte para o select do tipo de pagamento
    paymentOption.addEventListener("change", function(){
        if (paymentOption.value === "Dinheiro") {
            Troco.style.display = "block";
        } else {
            Troco.style.display = "none";
        }
    });

    // Finalizar compra
    checkoutButton.addEventListener('click', function () {
        if (cart.length > 0) {
            const payment = paymentOption.value;
            const delivery = deliveryOption.value;
            const address = customerAddress.value;
            const troco = customerTroco.value
            const total = parseFloat(cartTotal.textContent.replace('R$', ''));
            const clientName = clientNameInput.value;

            // Obtenha a lista de detalhes dos itens do carrinho
            const itemDetails = updateCart();

            // Construa a mensagem para o WhatsApp
            let mensagemWhatsApp = `Pedido de ${clientName}:\n`;

            // Adicione os detalhes dos itens do carrinho à mensagem
            itemDetails.forEach((item) => {
                mensagemWhatsApp += `${item}\n`;
            });
            
            mensagemWhatsApp += `\nTotal: R$${total.toFixed(2)}\nTipo de Pagamento: ${payment}\nTipo de Entrega: ${delivery}`;
            
            if ( delivery != "Entregar no endereço" && troco > total){
                const troco_formatado = (troco - total).toFixed(2);
                mensagemWhatsApp += `\nTroco: R$${troco_formatado}`;
            } else if (payment === "Dinheiro" && troco < total && semTroco === false){
                alert('Troco inválido, por favor insira um troco adequado')
                return;
            } else if (delivery === "Entregar no endereço" && troco > total) {
                const troco_formatado = (troco - total).toFixed(2);
                mensagemWhatsApp += `\nEndereço de Entrega: ${address}\nTroco: R$${troco_formatado}`
            }

            // Número de telefone para o qual você deseja enviar a mensagem (no formato internacional)
            const numeroTelefone = "5585998006527";

            // Construir a URL do WhatsApp com o número de telefone e a mensagem
            const urlWhatsApp = "https://api.whatsapp.com/send?phone=" + numeroTelefone + "&text=" + encodeURIComponent(mensagemWhatsApp);

            // Abrir uma nova aba no navegador para o WhatsApp
            window.open(urlWhatsApp, "_blank");

            cart = [];
            updateCart();
        } else {
            alert('Carrinho vazio. Adicione itens antes de finalizar o pedido.');
        }
    });
});