# Overnight Finance Arena MVP

## 1. Research findings

- Django forms/uploads/CSRF/transactions: use Django `Form`/`ModelForm` validation, always include CSRF tokens in internal POST forms, and wrap queue-claim logic in `transaction.atomic()` instead of ad hoc race-prone updates. Official docs: [file uploads](https://docs.djangoproject.com/en/5.2/topics/http/file-uploads/), [CSRF](https://docs.djangoproject.com/en/5.2/howto/csrf/), [transactions](https://docs.djangoproject.com/en/5.2/topics/db/transactions/), [auth](https://docs.djangoproject.com/en/5.2/topics/auth/default/).
- Django/PostgreSQL queueing: `select_for_update(skip_locked=True)` is the right primitive for multi-worker row claiming without blocking. PostgreSQL `FOR UPDATE SKIP LOCKED` intentionally skips locked rows instead of serializing the queue. Official docs: [Django queryset `select_for_update`](https://docs.djangoproject.com/en/5.2/ref/models/querysets/#select-for-update), [PostgreSQL `SELECT`](https://www.postgresql.org/docs/current/sql-select.html).
- HTMX polling: `hx-trigger="every 5s"` is the built-in polling pattern, which is enough for submission state refresh without SPA complexity. Official docs: [HTMX `hx-trigger`](https://htmx.org/attributes/hx-trigger/).
- ZIP handling: Python’s `zipfile` docs explicitly warn against extracting untrusted archives without validating paths. MVP therefore does manual extraction with path normalization, traversal rejection, symlink rejection, file-count and unpacked-size limits. Official docs: [Python `zipfile`](https://docs.python.org/3/library/zipfile.html).
- Subprocess safety: Python `subprocess` supports wall-clock timeouts and non-shell command execution. MVP uses a fixed argv list, never a shell command assembled from user input. Official docs: [Python `subprocess`](https://docs.python.org/3/library/subprocess.html).
- Docker/Compose: bind mounts are the simplest fit here, but sibling runner containers require host-visible paths, so Compose mounts the repo at the same absolute path inside `web` and `worker`. Official docs: [Docker Compose getting started](https://docs.docker.com/compose/gettingstarted/), [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/).
- Untrusted code execution: Docker resource flags (`--cpus`, `--memory`, `--pids-limit`, `--read-only`, `--network none`) help, but they do not make `docker.sock` safe. Docker documents that daemon access is root-equivalent. That is why the socket is mounted only into `worker`, never into `web`, and the runner image is allowlisted. Official docs: [resource constraints](https://docs.docker.com/engine/containers/resource_constraints/), [protect Docker daemon access](https://docs.docker.com/engine/security/protect-access/).

## 2. Final architecture

- `web`: Django app with templates, auth, upload form, leaderboard, HTMX polling.
- `postgres`: primary DB for auth, submissions, and queue state.
- `worker`: Django management command polling `Submission(status="queued")`, claiming jobs with `select_for_update(skip_locked=True)`, unpacking safely, launching runner container, scoring output, updating result.
- `runner`: separate Docker image, not part of Compose services; invoked by `worker` through Docker CLI and mounted host paths.
- `media/`: uploaded ZIP archives.
- `shared/runner_jobs/`: per-submission extracted workspaces and outputs, deleted after each run.

## 3. Security model

- User code never runs in Django or directly on the host process.
- `docker.sock` is mounted only into `worker`; `web` has no daemon access.
- Runner image is validated against `RUNNER_IMAGE_ALLOWLIST`.
- Runner command is fixed: `python /opt/action-arena/scorer.py --data /data/test.parquet --solution /submission --output /output/score.json`.
- Only the parquet evaluation dataset is mounted into the runner. The untrusted container receives no network access and no host write access except `/output`.
- No user-controlled shell commands, no `shell=True`.
- Runner gets `--network none`, `--read-only`, `--cap-drop ALL`, `--security-opt no-new-privileges`, `--cpus`, `--memory`, `--pids-limit`, and a dedicated writable `/output`.
- ZIP handling rejects absolute paths, `..`, symlinks, encrypted ZIPs, too many files, oversize uncompressed payloads, and suspicious compression ratios.
- Each job gets a fresh server-generated workdir under `shared/runner_jobs/`.
- Worker returns user-safe errors to the UI and logs technical details to stdout/stderr logs.

## 4. Implementation plan

- Build minimal Django app with built-in auth and one protected problem page.
- Use a single `Submission` table both as product data and queue.
- Poll queue state via HTMX row partials.
- Implement a dummy scorer now and keep a clean seam for replacing it with the quant scorer later.
- Package everything in Docker Compose with PostgreSQL and a separate runner image contract.

## 5. Code/files

- `arena/models.py`: `Submission` model and queue metadata.
- `arena/forms.py`: registration and ZIP upload validation.
- `arena/views.py`, `arena/urls.py`: problem page, leaderboard, auth flow, HTMX status endpoint.
- `arena/management/commands/run_scoring_worker.py`: queue worker.
- `arena/services/zip_utils.py`: secure ZIP validation and extraction.
- `arena/services/runner.py`: isolated Docker runner execution.
- `arena/services/scoring.py`: score JSON adapter.
- `templates/`, `static/css/app.css`: Django templates and minimal UI.
- `datasets/test.parquet`: local Action Arena evaluation fixture.
- `runner/Dockerfile`, `runner/scorer.py`, `runner/utils.py`: local Action Arena runner image and scorer.

## 6. Local run / README flow

1. Copy `.env.example` to `.env` and set `HOST_PROJECT_DIR` to the absolute repo path.
2. Build the local runner image:

   ```bash
   docker build -t hackathon-runner:local ./runner
   ```

3. Start the app stack:

   ```bash
   docker compose up --build
   ```

4. Create a superuser:

   ```bash
   docker compose exec web python manage.py createsuperuser
   ```

5. Open [http://localhost:8000](http://localhost:8000), register a user, or log in as admin.
6. For a sample submission, upload `examples/action_arena_solution.zip`.
7. Upload the ZIP on the problem page and watch the row update via HTMX.

## 7. Runner / scorer contract

### Submission contract

- Archive format: `.zip`.
- Required file: exactly one `solution.py`.
- `solution.py` must define a `PredictionModel` class.
- The runner executes:

  ```bash
  python /opt/action-arena/scorer.py --data /data/test.parquet --solution /submission --output /output/score.json
  ```

- Internet access is disabled.
- Dependency installation during execution is not supported.
- User code does not write a predictions file. The scorer imports `PredictionModel`, calls `predict(data_point)`, and writes `/output/score.json`.

### Expected model API

- `PredictionModel.predict(data_point)` must return `None` when `data_point.need_prediction` is false.
- It must return a numeric array with shape `(2,)` when `data_point.need_prediction` is true.
- The final score is mean weighted Pearson correlation.

### Updating the scorer

- Keep untrusted code inside the runner container.
- Update `runner/scorer.py` and `runner/utils.py` when the quant scorer contract changes.
- Keep Django reading only `/output/score.json`.

## 8. Environment variables

- `HOST_PROJECT_DIR`: absolute repo path on the Docker host. Required for sibling runner bind mounts.
- `POSTGRES_*`: DB connection.
- `SUBMISSION_MAX_UPLOAD_MB`: ZIP upload size cap.
- `ZIP_MAX_UNPACKED_MB`, `ZIP_MAX_FILES`, `ZIP_MAX_COMPRESSION_RATIO`: archive safety limits.
- `RUNNER_IMAGE`, `RUNNER_IMAGE_ALLOWLIST`: allowed scoring image(s).
- `RUNNER_TIMEOUT_SECONDS`, `RUNNER_CPUS`, `RUNNER_MEMORY`, `RUNNER_PIDS_LIMIT`, `RUNNER_TMPFS_SIZE`, `RUNNER_USER`: runner isolation knobs.

## 9. Notes for DevOps

- `worker` is security-sensitive because it has Docker daemon access. Do not expose it publicly.
- Do not mount `/var/run/docker.sock` into `web`.
- Pin the production runner image by digest, not only by tag.
- Treat the runner image as a curated environment with preinstalled ML dependencies.
- Consider moving from socket-mounted Docker to a stronger isolation boundary later: remote runner host, VM microservice, Firecracker, Kata, or Kubernetes jobs with tighter node isolation.
- This MVP does not attempt kernel-grade sandboxing. It is a pragmatic contest setup, not a multi-tenant hardened compute platform.
