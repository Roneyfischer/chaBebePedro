const idsSelecionados = [];

async function get() {
    try {
        const response = await fetch('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts?maxRecords=9000&view=Grid%20view', {
            headers: {
                'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303'
            }
        });
        const data = await response.json();

        const dataTable = document.getElementById('data-table');
        
        // Limpa o conteúdo da tabela
        dataTable.innerHTML = '';

        data.records.forEach(record => {
            if (record.fields.Selected == 0 && record.fields.Item) {
                const itemRow = document.createElement('div');
                itemRow.className = 'item-row';

                // Cria a célula para o Item
                const itemText = document.createElement('div');
                itemText.className = 'item-text';
                itemText.textContent = record.fields.Item;
                itemRow.appendChild(itemText);

                // Cria a célula para o botão Selecionar
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
                itemRow.appendChild(actionButton);

                // Adiciona a linha na tabela
                dataTable.appendChild(itemRow);
            }
        });

        // Adiciona a funcionalidade ao botão Confirmar
        document.getElementById('confirmar').addEventListener('click', async () => {
            if (idsSelecionados.length > 0) {
                try {
                    // Cria o corpo da requisição PATCH
                    const patchBody = {
                        records: idsSelecionados.map(id => ({
                            id: id,
                            fields: {
                                Selected: "1"
                            }
                        }))
                    };

                    const patchResponse = await fetch('https://api.airtable.com/v0/appLc4JSqHOsUIvnZ/gifts', {
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer patYbYNyN4tNRwfHp.232b7775a91392e82de4038c7f952e46fd604fcda43e80ed514ade111b1ce303',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(patchBody)
                    });

                    if (patchResponse.ok) {
                        showAlert('Seu(s) presente(s) foram registrados com sucesso!', 'success');
                        idsSelecionados.length = 0; // Limpa o array de IDs após a atualização
                        get(); // Atualiza a tabela
                    } else {
                        showAlert('Ops, ocorreu um erro. Por favor, marque novamente ou contate o Rôney.', 'danger');
                    }
                } catch (error) {
                    showAlert('Erro ao tentar realizar a atualização.', 'danger');
                }
            } else {
                showAlert('Nenhum item selecionado.', 'warning');
            }
        });
        
    } catch (error) {
        showAlert('Erro ao tentar buscar os dados.', 'danger');
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
