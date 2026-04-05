# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first to cache them
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xss512k", "-Xmx256m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
