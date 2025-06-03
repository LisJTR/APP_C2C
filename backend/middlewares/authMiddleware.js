import jwt from "jsonwebtoken";

/*
  Este middleware protege rutas que requieren autenticación. 
  Verifica si el cliente ha enviado un token JWT válido en la cabecera Authorization. 
  Si el token es válido, se decodifica y se guarda el contenido en req.user para que el controlador correspondiente 
  pueda saber qué usuario está haciendo la petición. Si el token falta o es inválido, la petición se rechaza con un error 401.
*/

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Comprobamos si la cabecera Authorization está presente y tiene el formato correcto

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
// Extraemos el token del encabezado (formato "Bearer <token>")
  const token = authHeader.split(" ")[1];

  try {
    // Verificamos y decodificamos el token con la clave secreta definida en las variables de entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos la información del usuario en req.user para que esté disponible en la siguiente función
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default authMiddleware;
