import { get, post, update, deletes } from './services.js'


const urlCustomers = "http://localhost:3000/customers"

const buttonCsv = document.getElementById('button_ccsv')


buttonCsv.addEventListener("click", () => {
    console.log("click");
    fetch('http://localhost:3000/importproducts',
        {
            method:'POST'
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();  // parsea la respuesta como JSON
        })
        .catch(error => {
            console.error('Error en fetch:', error);
            // Mostrar error en pantalla si quieres
        });
})


function obtener_datos() {
    try {
        let containerUsers = document.getElementById("customers-container");
        containerUsers.innerHTML = ""; // limpiar antes de mostrar

        let userData = get(urlCustomers)

        userData.then((data) => {
            console.log(data)
            data.forEach(customer => {
                let customerElement = document.createElement("div");
                customerElement.className = "customer";
                customerElement.innerHTML = `
                <div class="event-info">
                <p>ID: ${customer.id_customers}</p>
                <p>Name: ${customer.customerName}</p>
                <p>Address: ${customer.address}</p>
                <p>Phone: ${customer.phone}</p>
                <p>Email:${customer.email}</p>
                <button class="edit-customer-btn" >Editar</button>
                <button class="delete-customer-btn">Borrar</button>
                </div>
                `;
                containerUsers.appendChild(customerElement);
            });
        }).catch(error => {
            console.error("Error fetching customers:", error);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", obtener_datos);


//Este bloque sirve para que se pueda capturar el id del usuario que se va a editar
//Esto se hace por medio de delegacion de eventos: permite manejar elementos dinamicos, que no estan por defecto en el DOM 
let customerId;

document.getElementById("customers-container").addEventListener("click", async function (event) {
    if (event.target.matches('button[class="edit-customer-btn"]')) {
        // Obtener el ID del cliente
        customerId = event.target.parentElement.querySelector("p").textContent.split(": ")[1];
        console.log("ID del cliente a editar:", customerId);

        // Traer solo ese cliente
        const data = await get(urlCustomers);

        // Buscar usuario específico
        const customerToEdit = data.find(customer => customer.id_customers == customerId);

        if (customerToEdit) {
            document.getElementById("name").value = customerToEdit.customerName;
            document.getElementById("id").value = customerToEdit.id_customers;
            document.getElementById("address").value = customerToEdit.address;
            document.getElementById("phone").value = customerToEdit.phone;
            document.getElementById("email").value = customerToEdit.email;

            document.getElementById("submit-btn").textContent = "Save changes";
        }
    }
});


function addCustomer() {
    const form = document.getElementById("new-customer-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const id = document.getElementById("id").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;

        const newCustomer = {
            customerName:name,
            id_customers:id,
            address,
            phone,
            email
        };

        console.log("Enviando usuario:", newCustomer);

        try {
            // con este condicional hago que si hay un userId haga la actualziacion y si no hay haga el agregar
            if (customerId) {
                await update(urlCustomers, customerId, newCustomer);
                alert(" El usuario fue actualizado correctamente");
                form.reset();
                obtener_datos();

            } else {


                await post(urlCustomers, newCustomer);
                alert(" El usuario fue agregado correctamente");
                form.reset();
                obtener_datos();
            }
        } catch (error) {
            console.log("Error agregando usuario:", error);
        }
    });
}

addCustomer()

//Este bloque sirve para que se pueda capturar el id del usuario que se va a eliminar

// Este bloque sirve para capturar el id del usuario que se va a eliminar
let customerIddel;

document.getElementById("customers-container").addEventListener("click", function (event) {
    if (event.target.matches('button[class="delete-customer-btn"]')) {
        customerIddel = event.target.parentElement.querySelector("p").textContent.split(": ")[1];
        console.log(customerIddel);
        deleteUser(customerIddel);
    }
});

// Función para eliminar clientes
async function deleteUser() {
    console.log(`El cliente eliminado es: ${customerIddel}`);
    try {
        await deletes(urlCustomers, customerIddel);
        alert("El cliente fue eliminado correctamente");
        obtener_datos(); // refrescar lista
    } catch (error) {
        alert("No se pudo eliminar el cliente. Verifica el ID.");
        console.error("Error eliminando cliente:", error);
    }
}
