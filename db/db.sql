CREATE TABLE IF NOT EXISTS Users (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	password_hash TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Servers (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	owner_id TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (owner_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Messages (
	id TEXT PRIMARY KEY,
	sender_id TEXT NOT NULL,
	server_id TEXT NOT NULL,
	message_content TEXT NOT NULL,
	sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (sender_id) REFERENCES Users(id),
	FOREIGN KEY (server_id) REFERENCES Servers(id)
);

CREATE TABLE IF NOT EXISTS UserServers (
	user_id TEXT NOT NULL,
	server_id TEXT NOT NULL,
	joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, server_id),
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (server_id) REFERENCES Servers(id)
);


INSERT INTO [Users] (id, name, password_hash) VALUES ('user guid', 'tester', 'secret password hush');
INSERT INTO [Servers] (id, name, owner_id) VALUES ('server guid', 'Test server', 'user guid');
INSERT INTO [UserServers] (user_id, server_id) VALUES ('user guid', 'server guid');
INSERT INTO [Messages] (id, sender_id, server_id, message_content) VALUES ('message guid', 'user guid', 'server guid', 'test message');

