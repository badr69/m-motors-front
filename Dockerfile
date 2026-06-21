FROM nginx:alpine

COPY static/ /usr/share/nginx/html/static/
COPY views/ /usr/share/nginx/html/views/
COPY index.html /usr/share/nginx/html/