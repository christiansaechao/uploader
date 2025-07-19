# Use official Python image
FROM python:3.12.4

# Create a non-root user and group
# This addresses CKV_DOCKER_3 by ensuring the application does not run as root.
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser

# Create application directory
RUN mkdir /app

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

# Set ownership of the app directory to the non-root user
# This ensures the non-root user has necessary permissions.
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
# All subsequent instructions (like CMD) will run as this user.
USER appuser

# Expose port
EXPOSE 3001

# Add a HEALTHCHECK instruction
# This addresses CKV_DOCKER_2 by defining how to check container health.
# It attempts to curl the root endpoint of the FastAPI app on port 3001.
# --interval: how often to run the check (30s)
# --timeout: how long to wait for a response (10s)
# --start-period: initial grace period for the app to start (5s)
# --retries: how many times to retry before considering unhealthy (3)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:3001/ || exit 1

# Start FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
