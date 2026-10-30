-- Atualização para bancos criados antes da troca do hash de senha e da expiração do código

ALTER TABLE usuarios
  MODIFY senha VARCHAR(255) NOT NULL,
  ADD COLUMN codigo_expira DATETIME AFTER codigo_confirmacao,
  ADD COLUMN codigo_tentativas TINYINT NOT NULL DEFAULT 0 AFTER codigo_expira;

UPDATE usuarios SET codigo_confirmacao = NULL;
