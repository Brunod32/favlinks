const urlApi = 'https://dtw.azurewebsites.net/api'
const urlApiLinks = urlApi + '/links';
let currentPage = 1;
let isSearchMode = false;
let addEditModal = new bootstrap.Modal(document.getElementById("addLinkModal"), {});

function getLinks(perPage = 10, page =1){
    isSearchMode = false;
    const headers = new Headers();
    headers.append("Content-Type", "application/json")

    const init = {
        method: 'GET', 
        headers: headers
    };

    const urlRequete = urlApiLinks + '?perPage='+perPage+'&page='+page;
    fetch(urlRequete, init)
        .then(response => {
            return response.json();
        })
        .then(response => {
            //Déclare une chaine de caractères
            let myHtml = '';
            
            //Pour chaque lien que je reçoit de ma requête ajax
            response.forEach(element => {
                /*Je crée un élément en html, qui corresponds 
                à l'affichage de mon lien*/

            myHtml +=getCard(element.idLink, element.title, element.description, element.link, element.author.surName, element.author.foreName);

            });
            if(page == 1){
                //Premier affichage, on vide le contenu de la div
                document.getElementById("linksContainer").innerHTML = myHtml;
            }
            else{
                //étapes de pagination, on ajoute le contenu en s
                document.getElementById("linksContainer").innerHTML += myHtml;
            }
        })
        .catch(error =>{
            alert(error);
        });
}

function paginate(){
    currentPage ++;
    getLinks(15,currentPage)
}

function searchLinks(){
    isSearchMode = true;
    currentPage = 1;

    const search = document.getElementById("searchBarInput").value;
    
    if(search == '' || search == undefined){
        getLinks(15, currentPage);
    }
    else{
        const headers = new Headers();
        headers.append("Content-Type", "application/json")
    
        const init = {
            method: 'GET', 
            headers: headers
        };
    
        //https://dtw.azurewebsites.net/api/links/search?search=laur
        const urlRequete = urlApiLinks + '/search?search='+search;
    
        fetch(urlRequete, init)
            .then(response => {
                return response.json();
            })
            .then(response => {
                //Déclare une chaine de caractères
                let myHtml = '';
                
                //Pour chaque lien que je reçoit de ma requête ajax
                response.forEach(element => {
                    /*Je crée un élément en html, qui corresponds 
                    à l'affichage de mon lien*/
    
                    myHtml += getCard(element.idLink, element.title, element.description, element.link, element.author.surName, element.author.foreName);
    
                });
                if(myHtml != ''){
                    document.getElementById("linksContainer").innerHTML = myHtml;
                }
                else{
                    document.getElementById("linksContainer").innerHTML = `<span class="text-danger">Fin de l'affichage des résultats`;
                }
            })
            .catch(error =>{
                alert(error);
            });
    }

    
}

function editLinkModal(idlink){
    //Modification des éléments benins
    document.getElementById("addLinkModalLabel").innerText = "Modifier un lien";
    document.getElementById("btnValidationAddModal").hidden = true;
    document.getElementById("btnValidationEditModal").hidden = false;

    //Mettre les éléments de mon lien dans la modale, et l'afficher
    //Récupérer les valeurs de mon utilisateur, et les passer dans la modal
    const headers = new Headers();
    headers.append("Content-Type", "application/json")

    const init = {
        method: 'GET', 
        headers: headers
    };

    const urlRequete = urlApiLinks + '/' + idlink;
    fetch(urlRequete, init)
        .then(response => {
            return response.json();
        })
        .then(monLien => {
            document.getElementById("idLinkInput").value = monLien.idLink;
            document.getElementById("titreInput").value = monLien.title;
            document.getElementById("descriptionInput").value = monLien.description;
            document.getElementById("linksInput").value = monLien.link;
            document.getElementById("idAuthorInput").value = monLien.author.idUser;
        })
        .catch(error =>{
            alert(error);
        });
    addEditModal.show();
}

function editLinkAction(){
    let myForm = document.getElementById("addLinkForm");
    let formObj = new FormData(myForm);
    const headers = new Headers();
        headers.append("Content-Type", "application/json;charset=UTF-8")
    
        const body = JSON.stringify({
            idLink: +(formObj.get('idLink')),
            title: formObj.get('title'),
            description: formObj.get('description'),
            link: formObj.get('link'),
            idAuthor: +(formObj.get('idAuthor'))
        }); 

        const init = {
            method: 'PUT', 
            headers: headers,
            body: body
        };
    
        //https://dtw.azurewebsites.net/api/links
        const urlRequete = urlApiLinks + '/' + formObj.get('idLink');
    
        fetch(urlRequete, init)
            .then(response => {
                if(response.status == 200){
                    return response.json();
                }
                else{
                    alert("Une erreur est survenue");
                    return response;
                }
            })
            .then(element => {
                //Supprime dans la page la card du lien avant d'être modifié
                document.getElementById("cardLink"+element.idLink).remove();
                //Je génère la nouvelle card, et l'ajoute dans le html
                var myCard = getCard(element.idLink, element.title, element.description, element.link, 'Vous même', ' à l instant');
                var html = myCard + document.getElementById("linksContainer").innerHTML;
                document.getElementById("linksContainer").innerHTML = html;
                //je reset mon formulaire
                myForm.reset();
                //Je ferme la modale
                addEditModal.hide();
            })
            .catch(error =>{
                alert(error);
            });
}

function showAddLinkModal(){
    document.getElementById("addLinkModalLabel").innerText = "Ajouter un lien";
    document.getElementById("btnValidationAddModal").hidden = false;
    document.getElementById("btnValidationEditModal").hidden = true;
    document.getElementById("idLinkInput").value = '';
    document.getElementById("titreInput").value = '';
    document.getElementById("descriptionInput").value = '';
    document.getElementById("linksInput").value = '';
    document.getElementById("idAuthorInput").value = undefined;
    addEditModal.show();
}

function addLink(){
    let myForm = document.getElementById("addLinkForm");
    let formObj = new FormData(myForm);
    const headers = new Headers();
        headers.append("Content-Type", "application/json;charset=UTF-8")
    
        const body = JSON.stringify({
            title: formObj.get('title'),
            description: formObj.get('description'),
            link: formObj.get('link'),
            idAuthor: +(formObj.get('idAuthor'))
        }); 

        const init = {
            method: 'POST', 
            headers: headers,
            body: body
        };
    
        //https://dtw.azurewebsites.net/api/links
        const urlRequete = urlApiLinks;
    
        fetch(urlRequete, init)
            .then(response => {
                if(response.status == 201){
                    return response.json();
                }
                else{
                    alert("Une erreur est survenue");
                    return response;
                }
            })
            .then(element => {

                var myCard = getCard(element.idLink, element.title, element.description, element.link, 'Vous même', ' à l instant');

                var html = myCard + document.getElementById("linksContainer").innerHTML;
                document.getElementById("linksContainer").innerHTML = html;
                myForm.reset();
                addEditModal.hide();
            })
            .catch(error =>{
                alert(error);
            });
}

function deleteLink(idlink){
    if(confirm("Êtes-vous sûr.e de vouloir supprimer ce lien ? ")){
        //Si il est ok, on fait l'appel AJAX
        const headers = new Headers();
        const init = {
            method: 'DELETE', 
            headers: headers
        };
        //https://dtw.azurewebsites.net/api/{idLinks}
        const urlRequete = urlApiLinks +"/"+idlink;
        fetch(urlRequete, init)
            .then(response => {
                if(response.status == 200){
                    //Si supprimé en BDD, alors on le supprime dans le DOM
                    document.getElementById("cardLink"+idlink).remove();
                    alert('Votre lien a bien été supprimé');
                }
                else{
                    alert('Une erreur est survenue');
                }
            })
            .catch(error =>{
                alert(error);
            });
    }
}

function getCard(idLink, title, description, link, surName, foreName){
    let myHtml =
        `
        <div class="cardLinks" id="cardLink${idLink}">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">
                    ${description}
                    </p>
                    <a href="${link}" class="btn btn-primary">
                        Go !   
                    </a>
                </div>
                <div class="card-footer">
                    <small class="text-muted">By ${surName} ${foreName}</small>
                    <button onclick="deleteLink(${idLink})" class="btn btn-danger btn-delete-link"><i class="bi bi-trash3"></i></button>
                    <button onclick="editLinkModal(${idLink})" class="btn btn-info btn-delete-link"><i class="bi bi-pen"></i></button>
                </div>
            </div>
        </div>
        `;

        return myHtml;
        
}

document.addEventListener('DOMContentLoaded', function () {
    getLinks(15,1);

    //infite scroll
    window.addEventListener('scroll', () => {
        const {
            scrollTop,//Ce qui est au dessus de mon écran (j'ai déjà scrollé cette partie)
            scrollHeight,//La hauteur totale de mon site
            clientHeight//La hauteur de mon écran
        } = document.documentElement;
    
        if(!isSearchMode){
            if (scrollTop + clientHeight >= scrollHeight -5 ) {
                //action à faire pour le scroll infini
                paginate();
            }
        }
    });

  }, false);