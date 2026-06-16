import json
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path

from .exceptions import SubmissionProcessingError


@dataclass
class ScoreResult:
    score: Decimal
    rows_scored: int


def read_score_result(score_path: Path) -> ScoreResult:
    if not score_path.is_file():
        raise SubmissionProcessingError("Runner finished without producing score.json.")

    try:
        payload = json.loads(score_path.read_text(encoding="utf-8"))
        score = Decimal(str(payload["score"])).quantize(Decimal("0.000001"))
        rows_scored = int(payload["rows_scored"])
    except (KeyError, TypeError, ValueError, InvalidOperation, json.JSONDecodeError) as exc:
        raise SubmissionProcessingError("Runner produced an invalid score.json.") from exc

    return ScoreResult(score=score, rows_scored=rows_scored)
