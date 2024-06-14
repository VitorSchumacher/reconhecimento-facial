import React, { useRef, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import InputMask from "react-input-mask";
import { ErrorModal, SuccessModal } from "../../components/Modal";
import alunosData from "../../data/alunos.json";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100vh;
  background-color: #282c34;
  color: white;
  overflow: hidden;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1b1f23;
  padding: 20px;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 70%;
`;

const Label = styled.label`
  margin: 10px 0 5px;
  font-weight: bold;
  color: #9acd32;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  margin-bottom: 15px;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #9acd32;
  color: #1b1f23;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-itens: center;
  justify-content: center;

  &:hover {
    background-color: #76b900;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Crie um componente Styled para o spinner
const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 20px;
  height: 20px;
  animation: ${spin} 0.8s linear infinite;
`;

const VideoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1b1f23;
  padding: 20px;
  box-sizing: border-box;
`;

const Video = styled.video`
  width: 100%;
  max-width: 640px;
  height: auto;
  transform: scaleX(-1); /* Espelhar horizontalmente */
  border: 3px solid #9acd32;
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
`;

const CameraCapture = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [imageSrc, setImageSrc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    curso: "Sistemas de Informação",
  });
  const [errors, setErrors] = useState({});
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [alunos, setAlunos] = useState([]); 

  useEffect(() => {
    setAlunos(alunosData.Sheet);
  }, []);

  const buscarAlunoPorMatricula = (matricula) => {
    return alunos.find(aluno => aluno.RA === matricula);
  };

  useEffect(() => {
    startVideo(usingFrontCamera);
  }, [usingFrontCamera]);

  const startVideo = (front) => {
    const constraints = {
      video: {
        facingMode: front ? "user" : "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Erro ao acessar a câmera:", err));
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const image = canvasRef.current.toDataURL("image/png");
    setImageSrc(image);
    setCapturedImage(image); // Set the captured image
  };

  const discardImage = () => {
    setImageSrc("");
    setCapturedImage(null); // Reset the captured image
    startVideo(usingFrontCamera); // Restart the camera
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || !/^[A-Za-z\s]{1,50}$/.test(formData.nome)) {
      newErrors.nome =
        "Nome deve conter apenas letras e ser no máximo 50 caracteres.";
    }

    if (!formData.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido.";
    }

    if (!formData.matricula || !/^\d{6}$/.test(formData.matricula)) {
      newErrors.matricula = "Matrícula deve conter exatamente 6 números.";
    }

    if (!formData.curso) {
      newErrors.curso = "Curso é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  const sendImageToBackend = async () => {
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    const file = base64ToFile(imageSrc, 'captured.png');
    const data = new FormData();
    data.append('imagem', file);
    data.append('nome', formData.nome);
    data.append('cpf', formData.cpf);
    data.append('matricula', formData.matricula);
    data.append('curso', formData.curso);
  
    try {
      const response = await fetch('http://localhost:3005/salvar-aluno', {
        method: 'POST',
        body: data,
      });
  
      if (!response.ok) {
        // Se a resposta não for bem-sucedida, trate o erro aqui
        throw new Error('Erro ao enviar os dados. Código de status: ' + response.status);
      }
  
      setIsSubmitting(false);
      setIsModalOpen(true);
      setModalType("success");
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      setIsSubmitting(false);
      setIsModalOpen(true);
      setModalType("error");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se o campo alterado for matrícula, procurar o aluno pelo RA e preencher nome e curso se encontrado
    if (name === 'matricula') {
      const aluno = buscarAlunoPorMatricula(value);
      if (aluno) {
        setFormData({
          ...formData,
          [name]: value,
          nome: aluno.ALUNO,
          curso: aluno.CURSO,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          nome: '', // Limpar o nome se o aluno não for encontrado
          curso: '', // Limpar o curso se o aluno não for encontrado
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const clearForm = () => {
    setFormData({
      nome: "",
      cpf: "",
      matricula: "",
      curso: "Sistemas de Informação",
    });
    setImageSrc(""); // Limpar a imagem capturada, se houver
    setCapturedImage(null);
    startVideo(usingFrontCamera); 
  }
  return (
    <Container>
      <FormContainer>
        <Form>
          <Label htmlFor="matricula">Matrícula:</Label>
          <Input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            required
            pattern="\d{6}"
            disabled={isSubmitting}
            maxLength="6"
            placeholder="001122"
          />
          {errors.matricula && <ErrorMessage>{errors.matricula}</ErrorMessage>}
          <Label htmlFor="nome">Nome:</Label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            required
            placeholder="O nome será buscado automaticamente pelo seu RA"
          />
          {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}

          <Label htmlFor="cpf" >CPF:</Label>
          <InputMask
            mask="999.999.999-99"
            value={formData.cpf}
            onChange={handleChange}
          >
            {() => <Input type="text" id="cpf" name="cpf" required />}
          </InputMask>
          {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
          <Label htmlFor="curso">Curso:</Label>
          <Select
            id="curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="Sistemas de Informação">
              Sistemas de Informação
            </option>
            <option value="Pedagogia">Pedagogia</option>
            <option value="Direito">Direito</option>
            <option value="Hotelaria">Hotelaria</option>
            <option value="Ciências Contáveis">Ciências Contáveis</option>
            <option value="Gastronomia">Gastronomia</option>
            <option value="Ontopsicologia">Ontopsicologia</option>
            <option value="Administração">Administração</option>
          </Select>
          {errors.curso && <ErrorMessage>{errors.curso}</ErrorMessage>}

          <Button type="button" onClick={sendImageToBackend} disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Enviar'}
          </Button>
        </Form>
      </FormContainer>

      <VideoContainer>
        {capturedImage ? (
          <div>
            <h2>Imagem Capturada:</h2>
            <img src={capturedImage} alt="Imagem capturada" />
            <Button type="button" onClick={discardImage}>
              Tirar Outra Foto
            </Button>
          </div>
        ) : (
          <>
            <Video ref={videoRef} autoPlay muted />
            <canvas
              ref={canvasRef}
              width="320"
              height="240"
              style={{ display: "none" }}
            />
            <Button type="button" onClick={captureImage}>
              Capturar Imagem
            </Button>
          </>
        )}
      </VideoContainer>
        {isModalOpen && modalType === "error" && (
        <ErrorModal onClose={() => setIsModalOpen(false)} />
        )}
        {isModalOpen && modalType === "success" && (
          <SuccessModal onClose={() => setIsModalOpen(false)} clearForm={clearForm}/>
        )}
    </Container>
  );
};

export default CameraCapture;