class FormController {
    constructor() {
        this.inputNome = document.getElementById("nome");
        this.alert = document.getElementById("alert");

    }
    /**
     * Responde ao evente de clicar do botao pesquisar
     * 
     * @param {*} event 
     */
    search(event) {
        if (this.inputNome.validity.valid) {
            this.inputNome.classList.remove("is-invalid");
            this._getData(this.inputNome.value)
            this.closeMessage();
        } else {
            this.showMessage("Nome é obrigatório!");
            this.inputNome.classList.add("is-invalid");
        }
        event.preventDefault();
    }

    /**
     * Exibe o Alert de erro do bootstrap
     * 
     * @param {*} message 
     */
    showMessage(message) {
        document.getElementById("message").textContent = message;
        this.alert.classList.remove("invisible");
        this.alert.classList.add("visible");
    }

    /**
     * Fecha o Alert de erro do bootstrap
     * 
     * @param {*} message 
     */
    closeMessage() {
        document.getElementById("message").textContent = "";
        this.alert.classList.add("invisible");
        this.alert.classList.remove("visible");
    }

    /**
     * Pesquisa no site do IBGE
     * 
     * @param {*} nome - Nome da pessoa que se deseja pesquisar.
     */
    _getData(nome) {
        fetch(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nome}`)
            .then(response => response.json())
            .then(json => {
                if (json !== undefined && json.length > 0) {
                    return json[0];
                } else {
                    throw new Error("Nenhum registro encontrado.");
                }
            })
            .then(object => {
                this.closeMessage();
                this._fillTable(object);
            }).catch(error => {
                this.showMessage(error.message);
                document.getElementById("tbodyTable").innerHTML = '';
            });

    }

    /**
     * Preenche a tabela do Bootstrap
     * 
     * @param {*} resultado 
     */
    _fillTable(resultado) {

        function createTd(value) {
            const td = document.createElement('TD');
            if (!value) {
                value = "Sem dados";
            }
            if (typeof (value) === "object") {
                const ul = document.createElement("ul");
                value.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = `<div><b>Período: </b> ${item.periodo.replaceAll('[', '')}</div>  <b>Frequência: </b>${item.frequencia} </br>`;
                    ul.append(li);
                });
                td.append(ul);
            } else {
                td.textContent = value;
            }
            return td;
        }
        const tr = document.createElement("TR");
        tr.append(createTd(resultado.nome));
        tr.append(createTd(resultado.localidade));
        tr.append(createTd(resultado.res));
        console.log(document.getElementById("tbodyTable").getElementsByTagName("tr"));
        document.getElementById("tbodyTable").innerHTML = tr.outerHTML;
    }
}