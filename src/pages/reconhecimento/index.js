import React, { useRef, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import InputMask from "react-input-mask";
import { ErrorModal, SuccessModal } from "../../components/Modal";
import alunosData from "../../data/alunos.json";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 80vh;
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
  padding: 15px 75px;
  background-color: #9acd32;
  color: #1b1f23;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
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
  justify-content: center;
  align-items: center;
  background-color: #1b1f23;
  padding: 20px;
  box-sizing: border-box;
`;

const Video = styled.video`
  width: 100%;
  max-width: 860px;
  height: auto;
  transform: scaleX(-1); /* Espelhar horizontalmente */
  border: 3px solid #9acd32;
  border-radius: 8px;
`;

const CapturedImageContainer = styled.div`
  text-align: center;
  flex:1;
`;

const CapturedImage = styled.img`
  max-width: 100%;
  height: auto;
  transform: scaleX(-1); 
  border-radius: 8px;
`;

const CaptureButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Adicionando um espaço superior para separar visualmente do conteúdo acima */
`;

const CaptureAnotherButton = styled(Button)`
  padding: 15px 75px;
  background-color: #9acd32;
  color: #1b1f23;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #76b900;
  }
`;
const Title = styled.h2`
  color: #9acd32;
  text-align: center;
  width:100%;
  font-size: 24px;
`;

// Estilo para a mensagem informativa
const InfoMessage = styled.div`
  background-color: #282c34;
  border: 1px solid #9acd32;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
`;

const MessageText = styled.p`
  color: #fff;
`;
const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
`;

const DivButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const AlertBox = styled.div`
  background-color: #282c34;
  border: 1px solid #9acd32;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const InfoIcon = styled.span`
  font-size: 20px;
  color: #9acd32;
  margin-right: 10px;
`;

const CameraCapture = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [imageSrc, setImageSrc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage,setModalMessage] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    curso: "Sistemas de Informação",
  });
  const [errors, setErrors] = useState({});
  console.log(errors)
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

    if (!formData.nome) {
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
    if (!imageSrc) {
      newErrors.imageSrc = "Imagem é obrigatório.";
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
        console.log(response)
        throw new Error('Erro ao enviar os dados. Matricula ou rosto já cadastrados. Código de status: ' + response.status);
      }
  
      setIsSubmitting(false);
      setIsModalOpen(true);
      setModalType("success");
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      setIsSubmitting(false);
      setIsModalOpen(true);
      setModalType("error");
      setModalMessage(error?.message)
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
    <>
      <Header/>
    <Container>
      <FormContainer>
        <Form>
        <Title>Insira seus dados:</Title>
        <AlertBox>
          <InfoIcon>&#9432;</InfoIcon>
          <MessageText>
            O nome e o curso serão preenchidos automaticamente após o
            preenchimento do RA.
          </MessageText>
        </AlertBox>
          <Label htmlFor="matricula">Matrícula(RA):</Label>
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
            onChange={handleChange}
            required
            placeholder="..."
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
            <option value="Ciências Contábeis">Ciências Contáveis</option>
            <option value="Gastronomia">Gastronomia</option>
            <option value="Ontopsicologia">Ontopsicologia</option>
            <option value="Administração">Administração</option>
          </Select>
          {errors.curso && <ErrorMessage>{errors.curso}</ErrorMessage>}
          <DivButton>
            <Button type="button" onClick={sendImageToBackend} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Enviar'}
            </Button>
          </DivButton>
        </Form>
      </FormContainer>

      <VideoContainer>
        {capturedImage ? (
          <CapturedImageContainer>
            <Title>Imagem Capturada:</Title>
            <CapturedImage src={capturedImage} alt="Imagem capturada" />
            <CaptureButtonContainer>
              <CaptureAnotherButton type="button" onClick={discardImage}>
                Tirar Outra Foto
              </CaptureAnotherButton>
            </CaptureButtonContainer>
        </CapturedImageContainer>
        ) : (
          <CapturedImageContainer>
            <Video ref={videoRef} autoPlay muted />
            <canvas
              ref={canvasRef}
              width="860"
              height="650"
              style={{ display: "none" }}
            />
            <CaptureButtonContainer>

            <Button type="button" onClick={captureImage}>
              Tirar Foto
            </Button>
            </CaptureButtonContainer>
            </CapturedImageContainer>
        )}
      </VideoContainer>
        {isModalOpen && modalType === "error" && (
        <ErrorModal onClose={() => setIsModalOpen(false)} errorMsg={modalMessage}/>
        )}
        {isModalOpen && modalType === "success" && (
          <SuccessModal onClose={() => setIsModalOpen(false)} clearForm={clearForm}/>
        )}
    </Container>
    <Footer/>
    </>
  );
};

export default CameraCapture;