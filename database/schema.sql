-- Estrutura do banco de dados do Sabor Select (MySQL)

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha CHAR(32) NOT NULL,
  data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS receitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  ingredientes TEXT NOT NULL,
  modo_preparo TEXT NOT NULL,
  tempo_preparo VARCHAR(20),
  imagem VARCHAR(255),
  classificacao ENUM('pública', 'privada') NOT NULL DEFAULT 'pública',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);
