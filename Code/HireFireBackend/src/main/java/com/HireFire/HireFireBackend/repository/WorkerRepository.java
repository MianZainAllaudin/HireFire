package com.HireFire.HireFireBackend.repository;

import com.HireFire.HireFireBackend.model.Worker;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class WorkerRepository {
    private final Map<Long, Worker> workers = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Worker save(Worker worker) {
        if (worker.getId() == null) {
            worker.setId(idGenerator.getAndIncrement());
        }
        workers.put(worker.getId(), worker);
        return worker;
    }

    public Optional<Worker> findById(Long id) {
        return Optional.ofNullable(workers.get(id));
    }

    public List<Worker> findAll() {
        return new ArrayList<>(workers.values());
    }

    public void deleteById(Long id) {
        workers.remove(id);
    }

    // Add any other methods you need from the original repository
}