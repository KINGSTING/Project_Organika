from organika_backend import create_app
from config import Config

app = create_app()

if __name__ == "__main__":
    app.config.from_object(Config)
    app.run(debug=True)
