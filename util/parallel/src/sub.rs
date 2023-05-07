
// pub struct Client {
//     pub user_id: usize,
//     pub topics: Vec<String>,
//     pub sender: Option<mpsc::UnboundedSender<std::result::Result<Message, warp::Error>>>,
// }

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use std::error::Error;
use std::str;
use std::io;
use serde_json::json;
use warp::{Filter, Rejection, Reply};

mod handlers;
mod ws;

type Result<T> = std::result::Result<T, Rejection>;

const ADDR: &str = "localhost:25545";

#[tokio::main]
async fn main() {
    let TCPListener = TcpListener::bind(ADDR).await.unwrap();

    let (mut TCPSocket, _addr) = TCPListener.accept().await.unwrap();
    println!("Connected to addr: {}", _addr);

    let mut buffer = vec![0u8; 1024];

    let acc = r#"{
                        "action": "authenticate",
                        "data": {
                            "key_id": "API-KEY",
                            "secret_key": "SECRET-KEY"
                        }
                    }"#;

    TCPSocket.try_write(acc.as_bytes());

    let message = r#"{
                            "jsonrpc": "2.0",
                            "id": 1,
                            "method": "getFileNames",
                            "params": {
                                server: "home";
                            }
                        }"#;

    TCPSocket.write_all(message.as_bytes()).await.unwrap();
    println!("Message Sent: {}", message);
    println!("Awaiting for Response:");

    loop {
        TCPSocket.readable().await;
        match TCPSocket.try_read(&mut buffer) {
            Ok(n) => {
                buffer.truncate(n);
                break;
            }
            Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => {
                continue;
            }
            Err(e) => {
                continue;
            }
        }
    }


    let mut response: Vec<u8> = vec![];
    let mut bytes_read = 1;
    let mut total = 0;

    // while total < 1 {
    //     bytes_read = socket.read(&mut response).await.unwrap();
    //     println!("Bytes Received: {}", bytes_read);
    //     total += bytes_read;
    // }
    // let bytes = socket.read_exact(&mut response).await.unwrap();

    let message = match str::from_utf8(&buffer) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
    };
    println!("Response: {}", &message);

}

async fn handle_response(){

}

enum Request {

}
