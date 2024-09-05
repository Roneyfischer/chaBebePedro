const idsSelecionadosGifts = [];
const idsSelecionadosMimos = [];

async function get() {
    await fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts?view=Grid%20view', 'data-table-gifts', idsSelecionadosGifts);
    await fetchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos?view=Grid%20view', 'data-table-mimos', idsSelecionadosMimos);
}

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

                // Cria o botão de ação com o atributo data-id
                const actionButton = document.createElement('button');
                actionButton.textContent = 'Selecionar';
                actionButton.className = 'btn btn-primary';
                actionButton.setAttribute('data-id', record.id); // Adiciona o atributo data-id com o valor do ID

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




document.getElementById('confirmar').addEventListener('click', () => {
    // Verificar se há itens selecionados
    if (idsSelecionadosGifts.length > 0 || idsSelecionadosMimos.length > 0) {
        // Limpa a lista de itens selecionados no modal
        const itensSelecionadosList = document.getElementById('itens-selecionados-list');
        itensSelecionadosList.innerHTML = '';

        // Adiciona os itens de "Gifts" selecionados
        idsSelecionadosGifts.forEach(id => {
            const giftItem = document.querySelector(`#data-table-gifts .grid-item button[data-id="${id}"]`).parentElement.querySelector('h5').textContent;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = giftItem;
            itensSelecionadosList.appendChild(listItem);
        });

        // Adiciona os itens de "Mimos" selecionados
        idsSelecionadosMimos.forEach(id => {
            const mimoItem = document.querySelector(`#data-table-mimos .grid-item button[data-id="${id}"]`).parentElement.querySelector('h5').textContent;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = mimoItem;
            itensSelecionadosList.appendChild(listItem);
        });

        // Exibe o modal
        $('#confirmModal').modal('show');
    } else {
        showAlert('Nenhum item selecionado.', 'warning');
    }
});

// Ao clicar em "Confirmar" dentro do modal
document.getElementById('finalizarConfirmacao').addEventListener('click', async () => {
    try {
        const patchBodyGifts = idsSelecionadosGifts.length > 0 ? {
            records: idsSelecionadosGifts.map(id => ({
                id: id,
                fields: { Selected: "1" }
            }))
        } : null;

        const patchBodyMimos = idsSelecionadosMimos.length > 0 ? {
            records: idsSelecionadosMimos.map(id => ({
                id: id,
                fields: { Selected: "1" }
            }))
        } : null;

        if (patchBodyGifts) {
            await patchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts', patchBodyGifts);
        }

        if (patchBodyMimos) {
            await patchData('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/mimos', patchBodyMimos);
        }

        showAlert('Seu(s) presente(s) foram registrados com sucesso!', 'success');
        idsSelecionadosGifts.length = 0;
        idsSelecionadosMimos.length = 0;
        get(); // Atualiza ambas as tabelas

        // Fechar o modal
        $('#confirmModal').modal('hide');
    } catch (error) {
        showAlert('Ops, ocorreu um erro. Por favor, tente novamente.', 'danger');
    }
});


async function patchData(url, patchBody) {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchBody)
    });

    if (!response.ok) {
        throw new Error('Erro na atualização');
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



// Chama a função quando a página é carregada
window.onload = get;
