const idsSelecionadosGifts = [];
const idsSelecionadosMimos = [];
var Gifts = [];
var Mimos = [];
let guestName = '';
let guestCellphone = '';

// Função para buscar dados das tabelas
async function get() {
    try {
        await fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts?maxRecords=20&view=Grid%20view', 'data-table-gifts', idsSelecionadosGifts);
        await fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos?maxRecords=20&view=Grid%20view', 'data-table-mimos', idsSelecionadosMimos);
    } catch (error) {
        showAlert(`Erro ao carregar dados: ${error.message}`, 'danger');
    }
}

// Função para buscar dados da API
async function fetchData(url, tableId, idsSelecionados) {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303'
            }
        });
        const data = await response.json();
        const dataTable = document.getElementById(tableId);

        // Limpa o conteúdo da tabela
        dataTable.innerHTML = '';

        // Cria o contêiner da grade
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';

        data.records.forEach(record => {
            if (record.fields.Selected == 0 && record.fields.Item) {
                // Cria o item da grade
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';

                // Cria a imagem do item
                if (record.fields.Img) {
                    const img = document.createElement('img');
                    img.src = record.fields.Img; // Define a URL da imagem
                    img.alt = record.fields.Item; // Texto alternativo
                    gridItem.appendChild(img);
                }

                // Cria o título do item
                const itemText = document.createElement('h5');
                itemText.textContent = record.fields.Item;
                gridItem.appendChild(itemText);

                // Cria o botão de ação
                const actionButton = document.createElement('button');
                actionButton.textContent = 'Selecionar';
                actionButton.className = 'btn btn-primary';

                // Verifica se o item já está selecionado
                actionButton.addEventListener('click', () => {
                    const index = idsSelecionados.indexOf(record.id);
                    if (index === -1) {
                        idsSelecionados.push(record.id);
                        actionButton.textContent = 'Selecionado';
                        actionButton.className = 'btn btn-selecionado';
                    } else {
                        idsSelecionados.splice(index, 1);
                        actionButton.textContent = 'Selecionar';
                        actionButton.className = 'btn btn-primary';
                    }
                });

                // Adiciona o botão ao item da grade
                gridItem.appendChild(actionButton);

                // Adiciona o item à grade
                gridContainer.appendChild(gridItem);
            }
        });

        // Adiciona a grade ao container de dados
        dataTable.appendChild(gridContainer);

    } catch (error) {
        showAlert('Erro ao tentar buscar os dados.', 'danger');
    }
}

// Função para enviar dados com PATCH
async function patchData(url, patchBody) {
    console.log('Enviando dados para:', url);
    console.log('Corpo da requisição:', JSON.stringify(patchBody, null, 2));

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patchBody)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro na resposta:', responseData);
            throw new Error(`Erro ${response.status}: ${responseData.error.message}`);
        }
    } catch (error) {
        showAlert(`Erro na atualização: ${error.message}`, 'danger');
    }
}

// Função para enviar dados com POST, incluindo o campo AllGifts
async function postGuestData(url, postBody) {
    console.log('Enviando dados para:', url);
    console.log('Corpo da requisição:', JSON.stringify(postBody, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro na resposta:', responseData);
            throw new Error(`Erro ${response.status}: ${responseData.error.message}`);
        }
    } catch (error) {
        showAlert(`Erro ao enviar dados do convidado: ${error.message}`, 'danger');
    }
}

// Função para mostrar alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
    setTimeout(() => {
        $('.alert').alert('close');
    }, 3000);
}

// Função para obter os nomes dos itens selecionados
async function getSelectedItemsNames(idsSelecionados, url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303'
            }
        });
        const data = await response.json();
        const selectedNames = [];

        data.records.forEach(record => {
            if (idsSelecionados.includes(record.id)) {
                selectedNames.push(record.fields.Item);
            }
        });

        return selectedNames;
    } catch (error) {
        showAlert('Erro ao buscar os nomes dos itens selecionados.', 'danger');
        return [];
    }
}

$(document).ready(function () {
    $('#confirmacaoModal').modal({
        backdrop: 'static', // Impede fechar o modal ao clicar fora
        keyboard: false // Impede fechar o modal com a tecla ESC
    });
});

// Avança para a seleção de presentes e mimos
document.getElementById('btnProximo').addEventListener('click', () => {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('btnProximo').style.display = 'none';
    document.getElementById('btnFinalizar').style.display = 'inline-block';

    // Carrega os presentes e mimos no modal
    fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts?maxRecords=20&view=Grid%20view', 'modal-table-gifts', idsSelecionadosGifts);
    fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos?maxRecords=20&view=Grid%20view', 'modal-table-mimos', idsSelecionadosMimos);
});

// Finalizar processo de seleção
document.getElementById('btnFinalizar').addEventListener('click', async () => {
    // Exibe a modal de progresso
    $('#progressModal').modal('show');

    // Captura os valores dos campos nome e celular
    const nome = document.getElementById('nome').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const email = document.getElementById('email').value.trim();
    const acompanhantes = document.getElementById('acompanhantes').value.trim();

    if (nome && celular) {
        // Fecha o modal de confirmação
        $('#confirmacaoModal').modal('hide');

        try {
            // Obtém os nomes dos presentes e mimos selecionados
            const giftsNames = await getSelectedItemsNames(idsSelecionadosGifts, 'https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts?view=Grid%20view');
            const mimosNames = await getSelectedItemsNames(idsSelecionadosMimos, 'https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos?view=Grid%20view');

            // Cria o array com todos os nomes dos itens selecionados
            const allSelectedItems = [...giftsNames, ...mimosNames];

            // Envia os dados do convidado com os presentes e mimos selecionados
            const postBody = {
                fields: {
                    Guest: nome,
                    Cellphone: celular,
                    Guests: acompanhantes,
                    Email: email,
                    AllGifts: allSelectedItems.join(', ')
                }
            };

            await postGuestData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/guests', postBody);

            // Envia os presentes selecionados com o PATCH
            const patchBodyGifts = idsSelecionadosGifts.length > 0 ? {
                records: idsSelecionadosGifts.map(id => ({
                    id: id,
                    fields: { Selected: "1", Guest: nome, Cellphone: celular }
                }))
            } : null;

            const patchBodyMimos = idsSelecionadosMimos.length > 0 ? {
                records: idsSelecionadosMimos.map(id => ({
                    id: id,
                    fields: { Selected: "1", Guest: nome, Cellphone: celular }
                }))
            } : null;

            if (patchBodyGifts) await patchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts', patchBodyGifts);
            if (patchBodyMimos) await patchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos', patchBodyMimos);

            // Fecha a modal de progresso
            $('#progressModal').modal('hide');
            showAlert('Seleção finalizada com sucesso!', 'success');
        } catch (error) {
            showAlert(`Erro ao finalizar: ${error.message}`, 'danger');
        }
    }
});


// Função que verifica se todos os campos estão preenchidos
function checkFormValidity() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const acompanhantes = document.getElementById('acompanhantes').value.trim();

    // Verifica se todos os campos estão preenchidos
    if (nome && email && celular && acompanhantes) {
        document.getElementById('btnProximo').disabled = false; // Habilita o botão
    } else {
        document.getElementById('btnProximo').disabled = true; // Desabilita o botão
    }
}

// Adiciona um listener para todos os inputs e select
document.getElementById('nome').addEventListener('input', checkFormValidity);
document.getElementById('email').addEventListener('input', checkFormValidity);
document.getElementById('celular').addEventListener('input', checkFormValidity);
document.getElementById('acompanhantes').addEventListener('input', checkFormValidity);


document.getElementById('btnFinalizar').addEventListener('click', function() {
    // Fecha a modal (se não estiver usando automaticamente o Bootstrap para fechar)
    $('#confirmacaoModal').modal('hide');

    // Exibe a mensagem final
    document.querySelector('.finalMessage').style.display = 'block';
});
