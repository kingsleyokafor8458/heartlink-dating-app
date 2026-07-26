package com.heartlink.service;

import com.heartlink.dto.SafetyDtos.ReportRequest;
import com.heartlink.exception.ApiException;
import com.heartlink.model.Block;
import com.heartlink.model.Report;
import com.heartlink.repository.BlockRepository;
import com.heartlink.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final ReportRepository reportRepository;
    private final BlockRepository blockRepository;

    public Report reportUser(String reporterId, ReportRequest req) {
        if (reporterId.equals(req.reportedUserId())) {
            throw new ApiException("You can't report yourself", HttpStatus.BAD_REQUEST);
        }
        Report report = Report.builder()
                .reporterId(reporterId)
                .reportedUserId(req.reportedUserId())
                .reason(req.reason())
                .details(req.details())
                .status("PENDING")
                .createdAt(Instant.now())
                .build();
        return reportRepository.save(report);
    }

    public void blockUser(String blockerId, String blockedUserId) {
        if (blockerId.equals(blockedUserId)) {
            throw new ApiException("You can't block yourself", HttpStatus.BAD_REQUEST);
        }
        if (blockRepository.existsByBlockerIdAndBlockedUserId(blockerId, blockedUserId)) {
            return; // already blocked, no-op
        }
        blockRepository.save(Block.builder()
                .blockerId(blockerId)
                .blockedUserId(blockedUserId)
                .createdAt(Instant.now())
                .build());
    }

    public void unblockUser(String blockerId, String blockedUserId) {
        blockRepository.findByBlockerIdAndBlockedUserId(blockerId, blockedUserId)
                .ifPresent(blockRepository::delete);
    }

    public List<String> getBlockedUserIds(String blockerId) {
        return blockRepository.findByBlockerId(blockerId).stream()
                .map(Block::getBlockedUserId)
                .toList();
    }

    /** True if either user has blocked the other — used to gate browsing, swiping, and messaging. */
    public boolean isBlockedEitherWay(String userA, String userB) {
        return blockRepository.existsByBlockerIdAndBlockedUserId(userA, userB)
                || blockRepository.existsByBlockerIdAndBlockedUserId(userB, userA);
    }
}
