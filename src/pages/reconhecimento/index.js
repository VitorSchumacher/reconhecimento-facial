import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";

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
  max-width: 400px;
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

  &:hover {
    background-color: #76b900;
  }
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
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    curso: "Sistemas de Informação",
  });
  const [errors, setErrors] = useState({});
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

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

  const sendImageToBackend = async () => {
    if (!validateForm()) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const data = new FormData();
    data.append("image", blob, "captured.png");
    data.append("nome", formData.nome);
    data.append("cpf", formData.cpf);
    data.append("matricula", formData.matricula);
    data.append("curso", formData.curso);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: data,
    });

    const result = await response.text();
    console.log(result);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <FormContainer>
        <Form>
          <Label htmlFor="nome">Nome:</Label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]{1,50}"
            maxLength="50"
          />
          {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}

          <Label htmlFor="cpf">CPF:</Label>
          <InputMask
            mask="999.999.999-99"
            value={formData.cpf}
            onChange={handleChange}
          >
            {() => <Input type="text" id="cpf" name="cpf" required />}
          </InputMask>
          {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}

          <Label htmlFor="matricula">Matrícula:</Label>
          <Input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            required
            pattern="\d{6}"
            maxLength="6"
          />
          {errors.matricula && <ErrorMessage>{errors.matricula}</ErrorMessage>}

          <Label htmlFor="curso">Curso:</Label>
          <Select
            id="curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
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

          <Button type="button" onClick={sendImageToBackend}>
            Enviar
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
    </Container>
  );
};

export default CameraCapture;
