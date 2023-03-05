import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useState } from "react";

export function ModalBox(props) {

    const { visibility, handleModalClose, userData, userPets } = props;
    const [show, setShow] = useState(visibility);

    return (
        <>
            <Modal show={show} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <h3>{userData.first_name} {userData.last_name}</h3>
                </Modal.Header>
                <Modal.Body>
                    <h5>User Contact</h5>
                    <p><b>Email: </b>{userData.email}</p>
                    <p><b>Phone:</b>{userData.phone}</p>

                    <h5>{userData.first_name}'s Pets</h5>
                    {userPets.length > 0 ?
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    userPets.map((pet) => (
                                        <tr key={pet.id}>
                                            <td>{pet.type}</td>
                                            <td>{pet.name}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>

                        : <p>User do not own pets yet</p>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}