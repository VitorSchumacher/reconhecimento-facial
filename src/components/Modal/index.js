import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Sombra de fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Garante que o modal esteja sempre na parte superior */
`;

const ModalContent = styled.div`
  background-color: #282c34;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Sombra */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #9acd32;
  color: #1b1f23;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #76b900;
  }
`;

export const ErrorModal = ({ onClose }) => (
  <Modal>
    <ModalContent>
      <h2>Erro</h2>
      <p>Ocorreu um erro ao enviar os dados.</p>
      <Button onClick={onClose}>Fechar</Button>
    </ModalContent>
  </Modal>
);

export const SuccessModal = ({ onClose , clearForm}) => (
    <Modal>
      <ModalContent>
        <h2>Sucesso</h2>
        <p>Os dados foram enviados com sucesso.</p>
        <Button onClick={()=>{onClose();clearForm()}}>Fechar</Button>
      </ModalContent>
    </Modal>
  );
